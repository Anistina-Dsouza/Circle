const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { spawn, execSync } = require('child_process');
const { sleep, getRandomIdentity } = require('./utils/helpers');

// Import Test Modules
const { testSignup, testLogin, testLogout, testAdminLogin } = require('./modules/auth');
const { testSocialFlow } = require('./modules/social');
const { testStoriesFlow, testCirclesFlow, testJoinCircleFlow } = require('./modules/circles');
const { testMeetingsFlow } = require('./modules/meetings');
const { testAdminFlow } = require('./modules/admin');


async function cleanPorts() {
    console.log("CLEANUP: Cleaning up stale server processes...");
    const ports = [3000, 5173];
    for (const port of ports) {
        try {
            if (process.platform === 'win32') {
                const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
                const lines = stdout.split('\n');
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    if (parts.length > 4 && parts[1].endsWith(`:${port}`)) {
                        const pid = parts[parts.length - 1];
                        if (pid !== '0') {
                            try { execSync(`taskkill /F /T /PID ${pid}`); } catch (err) { }
                        }
                    }
                }
            } else {
                // Cross-platform support for Mac/Linux
                try { execSync(`lsof -ti:${port} | xargs kill -9`); } catch (err) { }
            }
        } catch (e) {
            // Port likely not in use or netstat found nothing
        }
    }
}

async function checkServer(url, timeout = 60000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        try {
            const resp = await fetch(url);
            if (resp.ok) return true;
        } catch (e) { }
        await new Promise(r => setTimeout(r, 2000));
    }
    return false;
}

async function startTests() {
    console.log("Initializing Modular Circle Stability Audit...");

    await cleanPorts();

    console.log("\nLaunching Backend & Frontend...");

    // Start backend and frontend servers
    const backend = spawn('cmd.exe', ['/c', 'npm run dev'], { cwd: '../backend' });
    const frontend = spawn('cmd.exe', ['/c', 'npm run dev'], { cwd: '../frontend' });

    console.log("Waiting for servers to be healthy...");
    const backendUp = await checkServer("http://localhost:3000/health");
    const frontendUp = await checkServer("http://localhost:5173");

    if (!backendUp || !frontendUp) {
        console.log("Server initialization failed. Check if ports 3000/5173 are blocked.");
        backend.kill();
        frontend.kill();
        process.exit(1);
    }
    console.log("Servers are online.");

    const options = new chrome.Options();
    options.addArguments('--start-maximized');
    options.addArguments('--disable-blink-features=AutomationControlled');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const baseUrl = "http://localhost:5173";

    // Test identity configuration
    const name = "Sym Gaming";
    const username = "symgaming19";
    const email = "symgaming19@gmail.com";
    const testPass = "SecurePass123!";

    try {
        // USER
        console.log(`TESTING WITH USER: ${name} (@${username})`);

        // Run Module 1: Auth
        await testSignup(driver, baseUrl, email, username, testPass);
        await testLogin(driver, baseUrl, email, testPass);

        // Run Module 2.5: Stories
        await testStoriesFlow(driver, baseUrl, username);

        // Run Module 2: Social & Profile
        await testSocialFlow(driver, baseUrl);

        // Run Module 3: Circles (Chat + Meetings)
        await testJoinCircleFlow(driver, baseUrl);
        const { meetingCreated } = await testCirclesFlow(driver, baseUrl, username);

        // Meeting flows
        await testMeetingsFlow(driver, baseUrl, meetingCreated);

        // ADMIN
        // Step 1: Logout after user part is done
        await testLogout(driver, baseUrl);

        // Step 2: Re-login as ADMIN for Admin Platform Audit
        const adminEmail = "admin@gmail.com";
        const adminPass = "password@123";
        console.log(`TESTING WITH USER: ${adminEmail}`);
        await testAdminLogin(driver, baseUrl, adminEmail, adminPass);

        // Run Module 5: Admin Platform
        await testAdminFlow(driver, baseUrl);


        console.log("\nALL MODULAR AUDIT PHASES PASSED SUCCESSFULLY");

    } catch (error) {
        console.log("\nAUDIT FATALITY:");
        console.log(error.message || error);
    } finally {
        console.log("\nSystem shutdown...");
        await driver.quit();
        backend.kill();
        frontend.kill();
        process.exit();
    }
}

startTests();