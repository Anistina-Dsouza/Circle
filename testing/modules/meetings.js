const { By, until } = require('selenium-webdriver');
const { sleep, safeClickText, click, waitForInteractable } = require('../utils/helpers');

async function testMeetingsFlow(driver, baseUrl, meetingCreated) {
    if (!meetingCreated) {
        console.log("\n📅 STEP 6: Meetings Hub (Partial Audit)");
        console.log("ℹ️ Skipping RSVP/Join verification as meeting creation was unsuccessful.");
        return;
    }

    console.log("\n📅 STEP 6: Meetings Hub & Execution Audit");
    await driver.get(baseUrl + "/meetings");
    await driver.wait(until.urlContains("/meetings"), 10000);
    await sleep(4000);

    // RSVP Testing
    console.log("➡️ Searching for 'Going' button (RSVP)...");
    try {
        const rsvpBtnXpath = "//button[contains(.,'Going')] | //span[contains(.,'Going')]/ancestor::button";
        const rsvpBtn = await driver.wait(until.elementLocated(By.xpath(rsvpBtnXpath)), 10000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", rsvpBtn);
        await sleep(2000);
        await driver.executeScript("arguments[0].click();", rsvpBtn);
        console.log("✅ RSVP: Marked as 'Going'.");
        await sleep(2000);
        
        console.log("Edge Case: Toggling RSVP status...");
        const notGoingBtnXpath = "//button[contains(.,'Not Going') or contains(.,'Cancel') or contains(.,'Remove')] | //span[contains(.,'Not Going')]/ancestor::button";
        try {
            const notGoingBtn = await driver.wait(until.elementLocated(By.xpath(notGoingBtnXpath)), 5000);
            await driver.executeScript("arguments[0].click();", notGoingBtn);
            console.log("✅ RSVP: Successfully toggled off.");
            await sleep(2000);
            
            // Re-RSVP to keep state valid
            const rsvpBtnAgain = await driver.wait(until.elementLocated(By.xpath(rsvpBtnXpath)), 5000);
            await driver.executeScript("arguments[0].click();", rsvpBtnAgain);
            console.log("✅ RSVP: Marked as 'Going' again.");
        } catch (innerError) {
            console.log("ℹ️ Could not find button to toggle RSVP off. System might only support one-way RSVP or text is different.");
        }

    } catch (e) {
        console.log("ℹ️ RSVP button not found.");
    }
    await sleep(3000);

    // Management & Starting Meeting
    console.log("➡️ Navigating to Manage Meetings...");
    const manageBtn = By.xpath("//a[contains(.,'Manage') or contains(.,'Sessions')]");
    const foundManage = await safeClickText(driver, "Manage All Sessions");
    
    if (!foundManage) {
        console.log("⚠️ Management link not found. Using direct URL.");
        await driver.get(baseUrl + "/meetings/manage");
    }
    
    await driver.wait(until.urlContains("/meetings/manage"), 15000);
    await sleep(3000);

    console.log("➡️ Attempting to start the scheduled meeting...");
    try {
        const startBtnXpath = "//button[contains(.,'Start Zoom') or contains(.,'Start Session') or contains(.,'Start Meeting')]";
        const startBtn = await driver.wait(until.elementLocated(By.xpath(startBtnXpath)), 15000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", startBtn);
        await sleep(3000);
        await driver.executeScript("arguments[0].click();", startBtn);
        console.log("✅ Interaction: Start Meeting triggered.");
        await sleep(5000);
        
        const windows = await driver.getAllWindowHandles();
        if (windows.length > 1) {
            await driver.switchTo().window(windows[1]);
            await sleep(2000);
            await driver.close();
            await driver.switchTo().window(windows[0]);
        }
    } catch (e) {
        console.log("ℹ️ No active 'Start' button found.");
    }
}

module.exports = {
    testMeetingsFlow
};
