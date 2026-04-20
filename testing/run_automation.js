const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { spawn, execSync } = require('child_process');
const { sleep, getRandomIdentity } = require('./utils/helpers');

// Import Test Modules
const { testSignup, testLogin } = require('./modules/auth');
const { testSocialFlow } = require('./modules/social');
const { testCirclesFlow } = require('./modules/circles');
const { testMeetingsFlow } = require('./modules/meetings');

/**
 * 🎯 CIRCLE MODULAR STABILITY AUDIT (V9)
 * Focus: Exact Locator Matching & Port Cleanup
 */

async function cleanPorts() {
    console.log("🧹 Cleaning up stale server processes...");
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
                        console.log(`🔫 Killing process ${pid} on port ${port}`);
                        execSync(`taskkill /F /PID ${pid}`);
                    }
                }
            }
        } catch (e) {
            // Port likely not in use
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
    console.log("🚀 Initializing Modular Circle Stability Audit...");

    await cleanPorts();

    // -------------------------------
    // 🔹 START SERVERS
    // -------------------------------
    console.log("\n📦 Launching Backend & Frontend...");
    
    // Using full command string to avoid DEP0190 on Windows
    const backend = spawn('cmd.exe', ['/c', 'npm run dev'], { cwd: '../backend' });
    const frontend = spawn('cmd.exe', ['/c', 'npm run dev'], { cwd: '../frontend' });

    console.log("⏳ Waiting for servers to be healthy...");
    const backendUp = await checkServer("http://localhost:3000/health");
    const frontendUp = await checkServer("http://localhost:5173");

    if (!backendUp || !frontendUp) {
        console.log("❌ Server initialization failed. Check if ports 3000/5173 are blocked.");
        backend.kill();
        frontend.kill();
        process.exit(1);
    }
    console.log("✅ Servers are online.");

    // -------------------------------
    // 🔹 SETUP DRIVER
    // -------------------------------
    const options = new chrome.Options();
    options.addArguments('--start-maximized');
    options.addArguments('--disable-blink-features=AutomationControlled');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();

    const baseUrl = "http://localhost:5173";
    
    // Humanized Identity Generation
    const { name, username, email } = getRandomIdentity();
    const testPass = "SecurePass123!";
    const uniqueId = Date.now().toString().slice(-4);

    try {
        console.log(`🧪 TESTING WITH USER: ${name} (@${username})`);

        // Run Module 1: Auth
        await testSignup(driver, baseUrl, email, username, testPass);
        await testLogin(driver, baseUrl, email, testPass);

        // Run Module 2: Social & Profile
        await testSocialFlow(driver, baseUrl);

        // Run Module 3: Circles (Stories + Chat + Meetings)
        const { meetingCreated } = await testCirclesFlow(driver, baseUrl, uniqueId, username);

        // Run Module 4: Meetings (Legacy RSVP & Join)
        await testMeetingsFlow(driver, baseUrl, meetingCreated);


        console.log("\n🏁 ALL MODULAR AUDIT PHASES PASSED SUCCESSFULLY");

    } catch (error) {
        console.log("\n❌ AUDIT FATALITY:");
        console.log(error.message || error);
    } finally {
        console.log("\n🧹 System shutdown...");
        await driver.quit();
        backend.kill();
        frontend.kill();
        process.exit();
    }
}

startTests();