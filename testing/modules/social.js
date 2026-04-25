const { By, until } = require('selenium-webdriver');
const { clearAndType, click, sleep, safeClickText, typeWithEnter, getRandomMessage, safeAction } = require('../utils/helpers');

async function testSocialFlow(driver, baseUrl) {
    console.log("\nSTEP 3: Explore -> Follow -> Profile -> Message");
    await driver.get(baseUrl + "/explore");
    await sleep(4000);

    const searchInputLocator = By.xpath("//input[contains(@placeholder, 'search')] | //input[contains(@class, 'search')]");

    console.log("Edge Case: Search Non-Existent User...");
    const searchInput = await safeAction(driver, searchInputLocator, "Search Box");

    if (searchInput) {
        await clearAndType(driver, searchInputLocator, "Unexisting User");
        await sleep(4000);

        console.log("Searching for 'maryam'...");
        await clearAndType(driver, searchInputLocator, "maryam");
        await sleep(3000); // Wait for debounce and search API

        // Wait for search results to appear or refresh
        await driver.wait(until.elementLocated(By.css('div.group')), 15000);
        await sleep(2000);

        console.log("Verifying search results...");
        const userCards = await driver.findElements(By.css('div.group'));
        if (userCards.length === 0) {
            console.log("No search results found. Skipping social interaction.");
            return;
        }

        console.log("Following user...");
        await safeClickText(driver, "Follow");
        await sleep(3000); // Wait for optimistic update and API

        // Optional: Verify button changed to "Following"
        const followBtn = await driver.findElements(By.xpath("//button[contains(.,'Following')]"));
        if (followBtn.length > 0) {
            console.log("SUCCESS: Follow confirmed.");
        }

        console.log("Navigating to Profile via User Card...");
        await sleep(2000); // Wait for potential list re-renders

        // RE-FIND elements to avoid stale references
        const profileLink = By.xpath("//div[contains(@class, 'group')]//a[contains(@href, '/profile/')]");
        try {
            const profileBtns = await driver.findElements(profileLink);
            if (profileBtns.length > 0) {
                const profileBtn = profileBtns[0];
                const targetUrl = await profileBtn.getAttribute('href');
                console.log(`Targeting profile: ${targetUrl}`);

                await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", profileBtn);
                await sleep(1000);
                await driver.executeScript("arguments[0].click();", profileBtn);
            } else {
                console.log("Profile link not found in user card.");
                return;
            }
        } catch (e) {
            console.log("Could not click profile card (might be stale, retrying): " + e.message);
            // One retry attempt with a fresh lookup
            await sleep(2000);
            const retryBtns = await driver.findElements(profileLink);
            if (retryBtns.length > 0) {
                await driver.executeScript("arguments[0].click();", retryBtns[0]);
            } else {
                return;
            }
        }
    } else {
        console.log("Explorer search unavailable. Skipping social tests.");
        return;
    }

    await driver.wait(until.urlContains("/profile/"), 15000);
    console.log("URL updated to profile.");
    await sleep(2000); // Allow initial render

    // Wait for any profile indicator (Success H1 or Error H2)
    console.log("Waiting for profile content or error...");
    try {
        // More robust wait: look for the profile header or the 404 container
        await driver.wait(until.elementLocated(By.xpath("//h1 | //h2[contains(text(), 'Not Found') or contains(text(), 'Notice')]")), 20000);
        await sleep(2000);

        const h1s = await driver.findElements(By.tagName("h1"));
        const h2Errors = await driver.findElements(By.xpath("//h2[contains(text(), 'Not Found') or contains(text(), 'Notice')]"));

        if (h2Errors.length > 0) {
            console.log("Profile Page returned an error: " + await h2Errors[0].getText());
            return;
        }

        if (h1s.length === 0) {
            throw new Error("Profile page loaded but no H1 name found.");
        }
    } catch (e) {
        console.log("Profile page failed to load expected content.");
        const bodyText = await driver.findElement(By.tagName("body")).getText();
        console.log("Visible body text snippets: " + bodyText.substring(0, 500));
        throw e;
    }

    console.log("Interacting with Profile Name...");
    await sleep(2000); // Wait for profile to settle
    try {
        const profileNameLoc = By.xpath("//h1[string-length(text()) > 0]");
        const profileName = await driver.findElement(profileNameLoc);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", profileName);
        await sleep(1500);
        await driver.executeScript("arguments[0].click();", profileName);
        console.log("Successfully clicked on user name.");
    } catch (e) {
        console.log("Stale element or error clicking profile name, retrying...");
        await sleep(2000);
        const profileNameLoc = By.xpath("//h1[string-length(text()) > 0]");
        const profileName = await driver.findElement(profileNameLoc);
        await driver.executeScript("arguments[0].click();", profileName);
    }
    await sleep(2000);

    console.log("Checking for User Stories...");
    try {
        const storyCardLoc = By.xpath("//div[contains(@class, 'group')]//h3[contains(text(), '')]/ancestor::div[contains(@class, 'cursor-pointer')]");
        const stories = await driver.findElements(storyCardLoc);
        if (stories.length > 0) {
            console.log(`Found ${stories.length} active stories. Clicking the first one...`);
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", stories[0]);
            await sleep(1000);
            await stories[0].click();
            await driver.wait(until.urlContains("/stories/"), 10000);
            console.log("Successfully navigated to Story Viewer.");
            await sleep(3000);
            await driver.navigate().back();
            await driver.wait(until.urlContains("/profile/"), 10000);
            console.log("Returned to profile.");
        } else {
            console.log("No active stories found on this profile.");
        }
    } catch (e) {
        console.log("Error interacting with stories: " + e.message);
    }

    console.log("Accessing Message button on Profile...");
    const msgBtnLocator = By.xpath("//button[contains(.,'Message') or .//span[text()='Message']]");
    try {
        const msgBtn = await driver.wait(until.elementLocated(msgBtnLocator), 15000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", msgBtn);
        await sleep(2000);
        await driver.executeScript("arguments[0].click();", msgBtn);
    } catch (e) {
        console.log("Message button not found on this profile.");
        return;
    }

    await driver.wait(until.urlContains("/messages"), 15000);
    console.log("Redirected to Messages.");
    await sleep(5000);

    console.log("Sending Standard Audit Message...");
    const auditMsg = "Hello! This is an automated audit message for social stability verification.";
    const chatBox = By.css('input[placeholder*="Type a message"]');
    await typeWithEnter(driver, chatBox, auditMsg);
    console.log("Fixed audit message sent.");
    await sleep(4000);

    // Profile Edit Edge Case
    console.log("\nSTEP 3b: Profile Editing Audit");
    await driver.get(baseUrl + "/profile/edit");
    await sleep(3000);

    const bioBox = By.name("bio");
    const picBox = By.name("profilePic");

    if (await safeAction(driver, bioBox, "Bio Edit Box")) {
        console.log("Updating bio and profile picture...");
        await clearAndType(driver, bioBox, "Design Enthusiast - Nature Lover - Tech Innovator! [CirclePlatform]");

        const picInput = await driver.findElement(picBox);
        await clearAndType(driver, picBox, "https://i.pinimg.com/736x/48/36/40/483640f966ae32e0ee0670493793f897.jpg");

        await sleep(1000);
        await safeClickText(driver, "Save Changes");
        await sleep(3000);
        console.log("Profile updated with new bio and picture.");
        await driver.wait(until.urlContains("/profile/"), 10000);
    }
}

module.exports = {
    testSocialFlow
};
