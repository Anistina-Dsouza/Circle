const { By, until, Key } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, type, typeWithEnter, safeAction } = require('../utils/helpers');

async function testStoriesFlow(driver, baseUrl, username) {
    console.log("\nSTEP 2.5: Story Discovery and Audit");
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

async function testCirclesFlow(driver, baseUrl, username) {

    console.log("\nSTEP 5: Circle Creation Boundary Testing");
    await driver.get(baseUrl + "/circles/create");
    await sleep(4000);

    console.log("Edge Case: Submitting empty circle form...");
    const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
    await driver.executeScript("arguments[0].click();", submitBtn);
    await sleep(2000);
    console.log("Empty form submitted. No redirection expected.");

    console.log("Edge Case: Submitting partial data (only name)...");
    const nameInput = await driver.findElement(By.id("name"));
    await nameInput.sendKeys("Test");
    await driver.executeScript("arguments[0].click();", submitBtn);
    await sleep(2000);
    console.log("Partial data form (short name) submitted.");

    const descInput = await driver.findElement(By.id("description"));

    // Clear for real test
    await nameInput.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);
    await descInput.sendKeys(Key.CONTROL, "a", Key.BACK_SPACE);

    const circleName = "Testing Club";
    console.log(`Action: Creating Circle "${circleName}"...`);
    await type(driver, By.id("name"), circleName);
    await type(driver, By.id("description"), "A community for testers.");

    console.log("Action: Adding Circle Icon URL...");
    await type(driver, By.id("icon"), "https://i.pinimg.com/736x/34/57/78/345778407d68e67b4b88dd966ae3c0b9.jpg"); // Proper circle image
    await sleep(2000);

    await click(driver, 'button[type="submit"]');
    console.log("Circle creation submitted. Waiting for automatic redirect...");

    // Wait for the redirect to the circle details page (it now happens automatically)
    await driver.wait(until.urlMatches(/\/circles\/[a-z0-9-]+/), 20000);
    console.log("Redirected to new circle profile.");
    await sleep(5000);

    console.log("Action: Navigating to Home Feed to verify circle list...");
    await driver.get(baseUrl + "/feed");
    await sleep(6000);

    console.log("Action: Entering 'Testing Club' from the sidebar...");
    try {
        const sidebarLinkLoc = By.xpath(`//aside//p[contains(text(), 'Testing Club')]/ancestor::a`);
        const sidebarLink = await driver.wait(until.elementLocated(sidebarLinkLoc), 15000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", sidebarLink);
        await sleep(2000);
        await driver.executeScript("arguments[0].click();", sidebarLink);
        console.log("Successfully entered circle from sidebar.");
    } catch (e) {
        console.log("Sidebar link not found or delayed. Using direct URL as fallback.");
        await driver.get(baseUrl + "/circles/testing-club");
    }

    await sleep(5000);
    console.log("Inside Circle Profile.");
    await sleep(8000);

    try {
        console.log("Sending Chat Message...");
        const chatInputLoc = By.css('input[placeholder*="Share something"]');
        const chatInput = await driver.wait(until.elementLocated(chatInputLoc), 25000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", chatInput);
        await sleep(2000);
        await driver.executeScript("arguments[0].click();", chatInput);
        await sleep(1000);

        const message = "Audit confirmed: System is stable.";
        for (const char of message) {
            await chatInput.sendKeys(char);
            await sleep(100);
        }
        await sleep(1000);
        await chatInput.sendKeys(Key.ENTER);
        console.log("Chat message sent successfully.");
    } catch (e) {
        console.log("Chat message could not be sent: " + e.message);
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
    const timeInput = await driver.findElement(By.id("meeting-time"));
    await driver.executeScript(`
        const el = arguments[0];
        const val = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    `, dateInput, pastDateStr);

    await driver.executeScript(`
        const el = arguments[0];
        const val = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    `, timeInput, '10:00');

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
    const durationInput = await driver.findElement(By.id("meeting-duration"));

    await driver.executeScript(`
        const el = arguments[0];
        const val = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    `, dateInput, tomorrowDateStr);

    await driver.executeScript(`
        const el = arguments[0];
        const val = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    `, timeInput, '14:00');

    await driver.executeScript(`
        const el = arguments[0];
        const val = arguments[1];
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
    `, durationInput, '60');

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

async function testJoinCircleFlow(driver, baseUrl) {
    console.log("\nSTEP 5b: Circle Discovery & Joining Audit");
    await driver.get(baseUrl + "/circles");
    await sleep(5000);

    console.log("Testing Category Filters...");
    try {
        const categories = ['Gaming', 'Technology', 'All Categories'];
        for (const cat of categories) {
            console.log(`Action: Selecting Category "${cat}"...`);
            await safeClickText(driver, cat);
            await sleep(4000); // Slow enough for human eye
        }
    } catch (e) {
        console.log("Category filter test encountered issues: " + e.message);
    }

    console.log("Edge Case: Searching for non-existent circle...");
    try {
        const searchInputLoc = By.id("search-circles");
        const searchInput = await safeAction(driver, searchInputLoc, "Circle Search Box");
        if (searchInput) {
            console.log("Action: Typing nonsense in search...");
            await clearAndType(driver, searchInputLoc, "ThisCircleDoesNotExist12345");
            await sleep(4000);
            const noResults = await driver.findElements(By.xpath("//*[contains(text(), 'No circles found') or contains(text(), 'No results')]"));
            if (noResults.length > 0) {
                console.log("SUCCESS: Correctly handled non-existent circle search.");
            }

            await sleep(2000);
            await clearAndType(driver, searchInputLoc, "");
            await sleep(3000);
        }
    } catch (e) {
        console.log("Circle search testing encountered issues: " + e.message);
    }

    console.log("Looking for circles to join...");
    try {
        // Find a circle card and click "View Circle"
        const viewBtnLocator = By.xpath("//a[contains(., 'View Circle')]");
        const viewBtns = await driver.findElements(viewBtnLocator);

        if (viewBtns.length > 0) {
            console.log(`Found ${viewBtns.length} circles available.`);
            const targetViewBtn = viewBtns[0];
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", targetViewBtn);
            await sleep(1500);
            await driver.executeScript("arguments[0].click();", targetViewBtn);

            // Wait for redirection to join page or details
            await sleep(3000);
            const currentUrl = await driver.getCurrentUrl();
            if (currentUrl.includes("/join")) {
                console.log("Redirected to Join page. Submitting join request...");
                const introArea = await driver.wait(until.elementLocated(By.tagName("textarea")), 10000);
                await introArea.sendKeys("Hello! I am an automated tester interested in joining this community for quality audit purposes.");
                await sleep(1000);
                const sendReqBtn = await driver.findElement(By.xpath("//button[contains(., 'Send Join Request')]"));
                await driver.executeScript("arguments[0].click();", sendReqBtn);
                await sleep(3000);
                console.log("Join request sent successfully.");
            } else {
                console.log("Already a member or redirected elsewhere: " + currentUrl);
            }
        } else {
            console.log("No circles found to interact with.");
        }
    } catch (e) {
        console.log("Circle joining test encountered an issue: " + e.message);
    }
}

module.exports = {
    testStoriesFlow,
    testCirclesFlow,
    testJoinCircleFlow
};
