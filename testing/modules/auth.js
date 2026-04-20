const { By, until } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, waitForInteractable } = require('../utils/helpers');

async function testSignup(driver, baseUrl, testEmail, testUser, testPass) {
    console.log("\n🔐 STEP 1: Signup Boundary Testing");
    await driver.get(baseUrl + "/signup");
    await sleep(2000);

    console.log("➡️ Edge Case: Submit Empty Fields...");
    const submitBtn = 'button[type="submit"]';
    await click(driver, submitBtn);
    await sleep(2000);

    console.log("➡️ Edge Case: Invalid Email Format...");
    await clearAndType(driver, By.name("email"), "not-an-email");
    await click(driver, submitBtn);
    await sleep(2000);

    console.log("➡️ Edge Case: Short Password (< 8 chars)...");
    await clearAndType(driver, By.name("email"), testEmail);
    await clearAndType(driver, By.name("password"), "123");
    await click(driver, submitBtn);
    await sleep(2000);

    console.log(`➡️ Performing Humanized Registration with Tags: ${testUser}`);
    await clearAndType(driver, By.name("username"), testUser);
    await clearAndType(driver, By.name("password"), testPass);
    
    // Select Interest Tags
    console.log("➡️ Selecting Interest Tags...");
    const interests = ["Technology", "Design", "Mindfulness"];
    for (const interest of interests) {
        await safeClickText(driver, interest);
        await sleep(500);
    }

    await click(driver, submitBtn);

    await driver.wait(until.urlContains("/feed"), 15000);
    console.log("✅ Signup successful.");
}

async function testLogin(driver, baseUrl, testEmail, testPass) {
    console.log("\n🔑 STEP 2: Login Boundary Testing");
    await driver.executeScript("window.localStorage.clear(); window.sessionStorage.clear(); window.location.reload();");
    await sleep(3000);
    await driver.get(baseUrl + "/login");
    await sleep(2000);

    const submitBtn = 'button[type="submit"]';

    console.log("➡️ Edge Case: Submit Empty Fields...");
    await click(driver, submitBtn);
    await sleep(2000);

    console.log("➡️ Edge Case: Non-Existent User...");
    await clearAndType(driver, By.name("email"), "ghost_tester_99@void.com");
    await clearAndType(driver, By.name("password"), "SomeSecretPass123!");
    await click(driver, submitBtn);
    await sleep(3000);

    console.log("➡️ Edge Case: Wrong Password...");
    await clearAndType(driver, By.name("email"), testEmail);
    await clearAndType(driver, By.name("password"), "IncorrectPass123!");
    await click(driver, submitBtn);
    await sleep(3000);

    console.log("➡️ Performing Valid Login...");
    await clearAndType(driver, By.name("password"), testPass);
    await click(driver, submitBtn);
    await driver.wait(until.urlContains("/feed"), 15000);
    console.log("✅ Login successful.");
}

module.exports = {
    testSignup,
    testLogin
};
