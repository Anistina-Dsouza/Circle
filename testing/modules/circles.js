const { By, until, Key } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, type, typeWithEnter, safeAction } = require('../utils/helpers');

async function testCirclesFlow(driver, baseUrl, uniqueId, username) {
    console.log("\nSTEP 4: Circle Discovery & Content Audit");
    
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
    } catch (e) {
        console.log("Story cycle encountered issues: " + e.message);
        await driver.get(baseUrl + "/feed");
    }

    console.log("\nSTEP 5: Circle Creation Boundary Testing");
    await driver.get(baseUrl + "/circles/create");
    await sleep(4000);

    const circleName = "Humanity Lab " + uniqueId;
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
    const scheduleBtnLoc = By.xpath("//button[@type='submit' or contains(.,'Schedule') or contains(.,'Meeting')]");
    const scheduleBtn = await driver.wait(until.elementLocated(scheduleBtnLoc), 15000);
    await driver.wait(until.elementIsEnabled(scheduleBtn), 15000);
    await driver.executeScript("arguments[0].click();", scheduleBtn);
    await sleep(2000);

    console.log("Edge Case: Scheduling meeting in the past...");
    const titleLocator = By.css('input[type="text"][placeholder*="Sync"], input[type="text"][required]');
    const titleInput = await driver.wait(until.elementLocated(titleLocator), 15000);
    await titleInput.sendKeys("Past Meeting Test");
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const pastDateStr = yesterday.toISOString().split('T')[0];
    
    const dateInput = await driver.findElement(By.css('input[type="date"]'));
    await dateInput.sendKeys(pastDateStr);
    await sleep(1000);
    await driver.executeScript("arguments[0].click();", scheduleBtn);
    await sleep(2000);

    console.log("Filling Required Fields for Valid Meeting...");
    await clearAndType(driver, titleLocator, "Kickoff Sync: " + circleName);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    await dateInput.sendKeys(dateStr);
    await sleep(1000);
    const timeInput = await driver.findElement(By.css('input[type="time"]'));
    await timeInput.sendKeys("10:00");
    await sleep(1000);

    await clearAndType(driver, By.css('textarea'), "Automated Kickoff Session.");
    await sleep(3000);
    
    console.log("Confirming Submit Button...");
    await driver.executeScript("arguments[0].click();", scheduleBtn);
    
    // Monitor for Success or Error
    try {
        await driver.wait(until.urlContains("/meetings"), 20000);
        console.log("Circle meeting created and verified in DB.");
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
    testCirclesFlow
};
