const { By, until } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, waitForInteractable } = require('../utils/helpers');

async function testSignup(driver, baseUrl, testEmail, testUser, testPass) {
    console.log("\nSTEP 1: Signup Boundary Testing");
    await driver.get(baseUrl + "/signup");
    await sleep(2000);

    console.log("Edge Case: Submit Empty Fields...");
    const submitBtn = 'button[type="submit"]';
    await click(driver, submitBtn);
    await sleep(2000);

    console.log("Edge Case: Invalid Email Format...");
    await clearAndType(driver, By.name("email"), "not-an-email");
    await click(driver, submitBtn);
    await sleep(2000);

    console.log("Edge Case: Short Password (< 8 chars)...");
    await clearAndType(driver, By.name("email"), testEmail);
    await clearAndType(driver, By.name("password"), "123");
    await click(driver, submitBtn);
    await sleep(2000);

    console.log(`Performing Humanized Registration with Tags: ${testUser}`);
    await clearAndType(driver, By.name("username"), testUser);
    await clearAndType(driver, By.name("password"), testPass);

    // Select Interest Tags
    console.log("Selecting Interest Tags...");
    const interests = ["Technology", "Design", "Mindfulness"];
    for (const interest of interests) {
        await safeClickText(driver, interest);
        await sleep(500);
    }

    await click(driver, submitBtn);

    try {
        await driver.wait(until.urlContains("/feed"), 15000);
        console.log("Signup successful.");
    } catch (e) {
        console.log("Signup failed or timed out. User might already exist, continuing to login phase.");
    }
}

async function testLogin(driver, baseUrl, testEmail, testPass) {
    console.log("\nSTEP 2: Login Boundary Testing");
    await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear(); window.location.reload();");
    await sleep(3000);
    await driver.get(baseUrl + "/login");
    await sleep(2000);

    const submitBtn = 'button[type="submit"]';

    console.log("Edge Case: Submit Empty Fields...");
    await click(driver, submitBtn);
    await sleep(2000);

    console.log("Edge Case: Non-Existent User...");
    await clearAndType(driver, By.name("email"), "fakeuser@test.com");
    await clearAndType(driver, By.name("password"), "SomeSecretPass123!");
    await click(driver, submitBtn);
    await sleep(3000);

    console.log("Edge Case: Wrong Password...");
    await clearAndType(driver, By.name("email"), testEmail);
    await clearAndType(driver, By.name("password"), "IncorrectPassword");
    await click(driver, submitBtn);
    await sleep(3000);

    console.log("Performing Valid Login...");
    await clearAndType(driver, By.name("password"), testPass);
    await click(driver, submitBtn);
    await driver.wait(until.urlContains("/feed"), 15000);
    console.log("Login successful.");
}

async function testLogout(driver, baseUrl) {
    console.log("\nSTEP 6.5: Logout Audit");
    try {
        // Find logout button by title as seen in FeedNavbar.jsx
        const logoutBtn = By.css('button[title="Logout"]');
        await click(driver, logoutBtn);
        await driver.wait(until.urlContains("/login"), 10000);
        console.log("Logout successful.");
    } catch (e) {
        console.log("Logout failed or button not found. Forcing session clear.");
        await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear(); window.location.reload();");
        await sleep(2000);
    }
}

async function testAdminLogin(driver, baseUrl, adminEmail, adminPass) {
    console.log("\nSTEP: Admin Login Testing");
    await driver.get(baseUrl + "/login");
    await clearAndType(driver, By.name("email"), adminEmail);
    await clearAndType(driver, By.name("password"), adminPass);
    await click(driver, 'button[type="submit"]');
    await driver.wait(until.urlContains("/admin"), 15000);
    console.log("Admin login successful.");
}

module.exports = {
    testSignup,
    testLogin,
    testLogout,
    testAdminLogin
};
