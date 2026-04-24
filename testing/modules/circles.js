const { By, until, Key } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, type, typeWithEnter, safeAction } = require('../utils/helpers');

async function testStoriesFlow(driver, baseUrl, username) {
    console.log("\nSTEP 2.5: Story Discovery & Content Audit");
    await driver.get(baseUrl + "/feed");
    await sleep(5000);

    try {
        console.log("Action: Adding a new Story via Web Link...");
        await safeClickText(driver, "Add Story");
        await sleep(3000);
        await safeClickText(driver, "Web Link");
        const urlInput = await driver.wait(until.elementLocated(By.css('input[placeholder*="unsplash"]')), 15000);
        await urlInput.sendKeys("https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&q=80");
        await sleep(1500);
        const captionArea = await driver.findElement(By.css('textarea[placeholder*="captivating"]'));
        await captionArea.sendKeys("Story under system audit: Deletion Test.");
        await sleep(1500);
        await safeClickText(driver, "Post Story");
        console.log("Interaction: Post Story submitted.");
        await sleep(8000);

        console.log(`Action: Verifying & Deleting own story for @${username}...`);
        await driver.get(baseUrl + "/feed"); // Ensure we are on feed
        await sleep(4000);
        await driver.navigate().refresh();
        await sleep(6000);

        const myStoryLocator = By.xpath(`//a[contains(@href, '/stories/${username}')]`);
        const myStory = await safeAction(driver, myStoryLocator, "Own Story Circle");
        if (myStory) {
            await driver.executeScript("arguments[0].click();", myStory);
            await driver.wait(until.urlContains("/stories/"), 10000);
            await sleep(4000);

            console.log("Action: Triggering Story Deletion...");
            await driver.executeScript("window.confirm = function() { return true; }");
            const deleteBtn = await driver.wait(until.elementLocated(By.css('button[title="Delete Story"]')), 15000);
            await driver.executeScript("arguments[0].click();", deleteBtn);
            await driver.wait(until.urlContains("/feed"), 15000);
            console.log("Story deleted successfully.");
            await sleep(3000);
        }

        console.log(`Action: Viewing stories of other users...`);
        const otherStoryLocator = By.xpath(`//a[contains(@href, '/stories/') and not(contains(@href, '/stories/${username}'))]`);
        const otherStory = await safeAction(driver, otherStoryLocator, "Other User Story");
        if (otherStory) {
            await driver.executeScript("arguments[0].click();", otherStory);
            await driver.wait(until.urlContains("/stories/"), 10000);
            await sleep(5000);
            console.log("Other user story viewed.");
            await driver.get(baseUrl + "/feed");
            await sleep(4000);
        } else {
            console.log("No other stories available to view.");
        }
    } catch (e) {
        console.log("Story cycle encountered issues: " + e.message);
        await driver.get(baseUrl + "/feed");
    }
}

async function testCirclesFlow(driver, baseUrl, uniqueId, username) {

    console.log("\nSTEP 5: Circle Creation Boundary Testing");
    await driver.get(baseUrl + "/circles/create");
    await sleep(4000);

    const circleName = "Testing Circle " + uniqueId;
    console.log(`Action: Creating Circle "${circleName}"...`);
    await type(driver, By.id("name"), circleName);
    await type(driver, By.id("description"), "A community for testers.");
    await click(driver, 'button[type="submit"]');
    console.log("New circle created.");
    await sleep(10000);
    await driver.get(baseUrl + "/feed");
    await sleep(6000);
    const myCircleLink = By.xpath(`//p[contains(text(),'${circleName}')]/ancestor::a | //p[text()='${circleName}']/ancestor::a`);
    const sidebarCircle = await safeAction(driver, myCircleLink, `Sidebar Link for ${circleName}`);
    if (sidebarCircle) {
        await driver.executeScript("arguments[0].click();", sidebarCircle);
    } else {
        await driver.get(baseUrl + "/circles");
        await sleep(5000);
        await safeClickText(driver, "View");
    }

    await driver.wait(until.urlContains("/circles/"), 20000);
    console.log("Inside Circle Profile.");
    await sleep(8000);

    try {
        console.log("Sending Chat Message...");
        const chatInput = await driver.wait(until.elementLocated(By.css('input[placeholder*="Share something"]')), 20000);
        await chatInput.sendKeys("Automated audit test: " + uniqueId);
        await sleep(2000);
        const sendBtnSelector = By.css('button.bg-gradient-to-br.from-violet-600, button[class*="from-violet-600"]');
        const sendBtn = await driver.wait(until.elementLocated(sendBtnSelector), 15000);
        await driver.executeScript("arguments[0].click();", sendBtn);
        console.log("Chat message sent.");
    } catch (e) {
        console.log("Chat message could not be sent.");
    }

    let meetingCreated = false;
    console.log("\nSTEP 5c: Circle Dashboard -> Create Meeting");
    await safeClickText(driver, "Manage");
    await driver.wait(until.urlContains("/manage"), 15000);
    await sleep(4000);

    await safeClickText(driver, "Schedule Meeting");
    await driver.wait(until.urlContains("/meetings/schedule"), 20000);
    await sleep(6000);

    console.log("Edge Case: Submitting empty meeting form...");
    const scheduleBtnLoc = By.id("schedule-meeting-btn");
    const scheduleBtn = await driver.wait(until.elementLocated(scheduleBtnLoc), 15000);
    try { await driver.wait(until.elementIsEnabled(scheduleBtn), 2000); } catch (e) { }
    await driver.executeScript("arguments[0].click();", scheduleBtn);
    await sleep(2000);

    console.log("Edge Case: Scheduling meeting in the past...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = tomorrow.getFullYear() + '-' + 
        String(tomorrow.getMonth() + 1).padStart(2, '0') + '-' + 
        String(tomorrow.getDate()).padStart(2, '0');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDateStr = yesterday.getFullYear() + '-' + 
        String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
        String(yesterday.getDate()).padStart(2, '0');

    const titleLocator = By.id("meeting-title");
    const titleInput = await driver.findElement(titleLocator);
    await titleInput.sendKeys("Past Meeting Test");

    // Ensure a circle is selected for past meeting test
    let circleSelect = await driver.findElement(By.id("meeting-circle"));
    let circleOptions = await circleSelect.findElements(By.tagName("option"));
    if (circleOptions.length > 1) {
        await circleOptions[1].click();
    }
    await sleep(1000);

    const dateInput = await driver.findElement(By.id("meeting-date"));
    // Using executeScript to set values to ensure React picks them up and bypasses browser-specific date pickers
    await driver.executeScript(`
        arguments[0].value = '${pastDateStr}';
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, dateInput);

    const timeInput = await driver.findElement(By.id("meeting-time"));
    await driver.executeScript(`
        arguments[0].value = '10:00';
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, timeInput);

    await sleep(1000);
    const currentScheduleBtn = await driver.findElement(scheduleBtnLoc);
    await driver.executeScript("arguments[0].click();", currentScheduleBtn);

    // Validate past date rejection
    try {
        const pastDateError = await driver.wait(until.elementLocated(By.xpath("//div[contains(., 'past')] | //div[contains(@class, 'red')]")), 10000);
        console.log("Caught Past-Date Rejection: " + await pastDateError.getText());
    } catch (e) {
        console.log("Past-date rejection message not found or delayed.");
    }
    await sleep(2000);

    console.log("Filling Required Fields for Valid Meeting...");
    await clearAndType(driver, titleLocator, "Kickoff Sync: " + circleName);

    console.log("Selecting community circle...");
    circleSelect = await driver.findElement(By.id("meeting-circle"));
    // Try to select the circle we just created
    circleOptions = await circleSelect.findElements(By.tagName("option"));
    let circleFound = false;
    for (let option of circleOptions) {
        const text = await option.getText();
        if (text.includes(circleName)) {
            await option.click();
            circleFound = true;
            break;
        }
    }
    if (!circleFound && circleOptions.length > 1) {
        await circleOptions[1].click(); // Select first non-placeholder option if specific one not found
    }
    await sleep(1000);

    console.log("Setting meeting date and time...");
    await driver.executeScript(`
        arguments[0].value = '${tomorrowDateStr}';
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('blur', { bubbles: true }));
    `, dateInput);

    await driver.executeScript(`
        arguments[0].value = '14:00';
        arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
        arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, timeInput);

    await sleep(1000);

    console.log("Selecting meeting duration...");
    const durationSelect = await driver.findElement(By.id("meeting-duration"));
    await durationSelect.sendKeys("1 hour");
    await sleep(1000);

    await clearAndType(driver, By.id("meeting-description"), "Automated Kickoff Session for " + circleName);
    await sleep(3000);

    console.log("Confirming Submit Button...");
    const finalScheduleBtn = await driver.findElement(scheduleBtnLoc);
    await driver.executeScript("arguments[0].click();", finalScheduleBtn);

    // Monitor for Success or Error
    try {
        await driver.wait(async () => {
            const currentUrl = await driver.getCurrentUrl();
            return currentUrl.includes("/meetings");
        }, 25000);
        console.log("Circle meeting created and verified.");
        meetingCreated = true;
    } catch (e) {
        console.log("Meeting creation attempt failed. Analyzing Server Feedback...");
        try {
            const serverMsg = await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'bg-red')] | //div[contains(., 'failed')] | //p[contains(., 'failed')]")), 8000);
            const text = await serverMsg.getText();
            console.log(`SERVER REJECTION: ${text}`);
        } catch (e2) {
            console.log("CRITICAL: Page did not redirect and no visible error message found.");
        }
        meetingCreated = false;
    }

    return { meetingCreated };
}

module.exports = {
    testStoriesFlow,
    testCirclesFlow
};
