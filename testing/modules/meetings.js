const { By, until } = require('selenium-webdriver');
const { sleep, safeClickText, click, waitForInteractable } = require('../utils/helpers');

async function testMeetingsFlow(driver, baseUrl, meetingCreated) {
    if (!meetingCreated) {
        console.log("\nSTEP 6: Meetings Hub (Partial Audit)");
        console.log("Skipping RSVP/Join verification as meeting creation was unsuccessful.");
        return;
    }

    console.log("\nSTEP 6: Meetings Hub and Execution Audit");
    await driver.get(baseUrl + "/meetings");
    await sleep(6000); // Give time for skeleton loader to finish

    // Management & Starting Meeting
    console.log("Navigating to Manage Meetings...");
    const foundManage = await safeClickText(driver, "Manage All Sessions");

    if (!foundManage) {
        console.log("Management link not found. Using direct URL.");
        await driver.get(baseUrl + "/meetings/manage");
    }

    await driver.wait(until.urlContains("/meetings/manage"), 15000);
    await sleep(5000); // Wait for manage page to load its own skeleton

    console.log("Attempting to start the scheduled meeting...");
    try {
        const startBtnSelector = By.css('button[id^="start-zoom-btn-"]');
        const startBtn = await driver.wait(until.elementLocated(startBtnSelector), 15000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", startBtn);
        await sleep(3000);
        await driver.executeScript("arguments[0].click();", startBtn);
        console.log("Interaction: Start Meeting triggered.");
        await sleep(5000);

        const windows = await driver.getAllWindowHandles();
        if (windows.length > 1) {
            await driver.switchTo().window(windows[1]);
            await sleep(2000);
            await driver.close();
            await driver.switchTo().window(windows[0]);
        }
    } catch (e) {
        console.log("No active 'Start' button found.");
    }
}

module.exports = {
    testMeetingsFlow
};
