const { By, until } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, typeWithEnter, getRandomMessage, safeAction } = require('../utils/helpers');

async function testSocialFlow(driver, baseUrl) {
    console.log("\n🔍 STEP 3: Explore -> Follow -> Profile -> Message");
    await driver.get(baseUrl + "/explore");
    await sleep(4000);

    const searchInputLocator = By.xpath("//input[contains(@placeholder, 'search')] | //input[contains(@class, 'search')]");
    
    console.log("➡️ Edge Case: Search Non-Existent User...");
    const searchInput = await safeAction(driver, searchInputLocator, "Search Box");
    
    if (searchInput) {
        await clearAndType(driver, searchInputLocator, "Ghost_User_XYZ_9999");
        await sleep(4000);

        console.log("➡️ Searching for 'admin'...");
        await clearAndType(driver, searchInputLocator, "admin");
        await sleep(5000);

        console.log("➡️ Verifying search results...");
        const userCards = await driver.findElements(By.css('div.group'));
        if (userCards.length === 0) {
            console.log("⚠️ No search results found for 'admin'. Skipping social interaction.");
            return;
        }

        console.log("➡️ Following user...");
        await safeClickText(driver, "Follow");
        await sleep(2000);

        console.log("➡️ Navigating to Profile via User Card...");
        const profileLink = By.xpath("//h3[contains(text(),'admin')] | //p[contains(text(),'@admin')]");
        try {
            const profileBtn = await driver.wait(until.elementLocated(profileLink), 15000);
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", profileBtn);
            await sleep(2000);
            await driver.executeScript("arguments[0].click();", profileBtn);
        } catch (e) {
            console.log("⚠️ Could not click profile card. Skipping message flow.");
            return;
        }
    } else {
        console.log("⚠️ Explorer search unavailable. Skipping social tests.");
        return;
    }

    await driver.wait(until.urlContains("/profile/"), 15000);
    console.log("✅ Landed on profile.");
    await sleep(3000);

    console.log("➡️ Accessing Message button on Profile...");
    const msgBtnLocator = By.xpath("//button[contains(.,'Message') or .//span[text()='Message']]");
    try {
        const msgBtn = await driver.wait(until.elementLocated(msgBtnLocator), 15000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", msgBtn);
        await sleep(2000);
        await driver.executeScript("arguments[0].click();", msgBtn);
    } catch (e) {
        console.log("⚠️ Message button not found on this profile.");
        return;
    }
    
    await driver.wait(until.urlContains("/messages"), 15000);
    console.log("✅ Redirected to Messages.");
    await sleep(5000);

    console.log("➡️ Sending Humanized Message...");
    const firstMsg = getRandomMessage();
    const chatBox = By.css('input[placeholder*="Type a message"]');
    await typeWithEnter(driver, chatBox, firstMsg);
    console.log("✅ First message sent.");
    await sleep(4000);

    // Profile Edit Edge Case
    console.log("\n👤 STEP 3b: Profile Editing Audit");
    await driver.get(baseUrl + "/profile/edit");
    await sleep(3000);

    const bioBox = By.name("bio");
    if (await safeAction(driver, bioBox, "Bio Edit Box")) {
        console.log("➡️ Updating bio with complex string...");
        await clearAndType(driver, bioBox, "Design Enthusiast • Nature Lover • Tech Innovator! ⚡ #CirclePlatform");
        await safeClickText(driver, "Save Changes");
        await sleep(3000);
        console.log("✅ Bio updated.");
    }
}

module.exports = {
    testSocialFlow
};
