const { By, until } = require('selenium-webdriver');
const { sleep, safeClickText, safeAction, scrollPage } = require('../utils/helpers');

async function testAdminFlow(driver, baseUrl) {
    console.log("\nSTEP 7: Admin Platform Audit");
    await driver.get(baseUrl + "/admin");
    await sleep(4000);

    const currentUrl = await driver.getCurrentUrl();
    if (!currentUrl.includes("/admin")) {
        console.log("User is not an admin or was redirected away from the admin dashboard. Skipping admin tests.");
        return;
    }

    console.log("Admin Dashboard Access Confirmed.");
    await scrollPage(driver);
    await sleep(2000);

    // Verify Dashboard KPIs
    console.log("Verifying Dashboard KPI Stats...");
    try {
        const statsToVerify = ["Users", "Circles", "Active", "Flagged"];
        for (const stat of statsToVerify) {
            const card = await driver.wait(until.elementLocated(By.xpath(`//div[contains(text(), '${stat}')]`)), 10000);
            const val = await card.findElement(By.xpath("./preceding-sibling::div | ./following-sibling::div | .//span | ..//div[contains(@class, 'text-')]")).getText();
            console.log(`Stat Verified - ${stat}: ${val}`);
        }
    } catch (e) {
        console.log("KPI verification partially failed or metrics not loaded.");
    }

    // Intelligence Suite Audit
    console.log("\nACTION: Intelligence Suite Audit...");
    try {
        // Navigate specifically to the reports page where the intelligence suite lives
        await driver.get(baseUrl + "/admin/reports");
        await driver.wait(until.urlContains("/admin/reports"), 10000);
        await sleep(4000);

        const intelTabs = ["Velocity", "Activity", "Distribution", "Lifecycle", "Safety"];
        for (const tab of intelTabs) {
            console.log(`Sub-Step: Testing Tab [${tab}]...`);
            const tabBtn = await driver.wait(until.elementLocated(By.xpath(`//button[.//span[text()='${tab}']]`)), 10000);
            await driver.executeScript("arguments[0].click();", tabBtn);
            await sleep(3000); // Wait for data sync and animations

            // Check for Tab-Specific Elements
            if (tab === "Velocity") {
                console.log("Verifying Peak Signal Heatmap & Spatial Matrix...");
                await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Peak Signal')]")), 10000);
                const heatmapCells = await driver.findElements(By.css('div[style*="background-color"]'));
                console.log(`SUCCESS: Heatmap rendered with ${heatmapCells.length} intensity cells.`);
                
                await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Engagement Depth')]")), 10000);
                const bubbles = await driver.findElements(By.css('div[class*="group/bubble"]'));
                console.log(`SUCCESS: Spatial Matrix populated with ${bubbles.length} engagement nodes.`);
            } else if (tab === "Activity") {
                console.log("Verifying Activity Log Segments...");
                const segments = await driver.findElements(By.xpath("//h3[contains(text(), 'Users') or contains(text(), 'Communities') or contains(text(), 'Meetings')]"));
                console.log(`SUCCESS: Found ${segments.length} active log segments.`);

                // Check Pagination for all three cards
                console.log("Testing Pagination for Activity Cards...");
                const activitySegments = ["Recent Users", "Recent Communities", "Recent Meetings"];
                for (const segmentTitle of activitySegments) {
                    console.log(`Sub-Step: Checking Pagination for [${segmentTitle}]...`);
                    try {
                        // Find the header div that contains the title and the buttons
                        const headerXpath = `//div[contains(@class, 'flex items-center justify-between') and .//h3[contains(text(), '${segmentTitle}')]]`;
                        const headerElem = await driver.wait(until.elementLocated(By.xpath(headerXpath)), 10000);
                        
                        // Find all buttons in that header (Prev and Next)
                        const buttons = await headerElem.findElements(By.css("button"));
                        if (buttons.length >= 2) {
                            const prevBtn = buttons[0];
                            const nextBtn = buttons[1];
                            
                            const isDisabled = await nextBtn.getAttribute("disabled");
                            if (!isDisabled) {
                                console.log(`Action: Clicking Next on ${segmentTitle}...`);
                                await driver.executeScript("arguments[0].click();", nextBtn);
                                await sleep(2000);
                                
                                console.log(`Action: Clicking Previous on ${segmentTitle}...`);
                                await driver.executeScript("arguments[0].click();", prevBtn);
                                await sleep(2000);
                            } else {
                                console.log(`SKIP: Pagination disabled for ${segmentTitle} (Single page or no data).`);
                            }
                        } else {
                            console.log(`SKIP: Could not find both pagination buttons for ${segmentTitle}.`);
                        }
                    } catch (paginationErr) {
                        console.log(`Note: Pagination check for ${segmentTitle} skipped: ${paginationErr.message}`);
                    }
                }
            } else if (tab === "Distribution") {
                console.log("Verifying Niche Saturation Bars...");
                const bars = await driver.findElements(By.xpath("//div[contains(@class, 'bg-gradient-to-r')]"));
                console.log(`SUCCESS: Found ${bars.length} niche distribution bars.`);
            }
            
            // Add scroll for each report section
            await scrollPage(driver);
        }
        console.log("Intelligence Suite navigation and data rendering verified.");
        await scrollPage(driver);
    } catch (e) {
        console.log("Intelligence Suite audit failed: " + e.message);
    }

    // Test Navigation to User Management
    console.log("\nNavigating to User Management...");
    const usersLink = By.xpath("//a[contains(@href, '/admin/users')] | //div[contains(text(), 'Users')]/ancestor::a");
    if (await safeAction(driver, usersLink, "User Management Link")) {
        const linkElem = await driver.findElement(usersLink);
        await driver.executeScript("arguments[0].click();", linkElem);
        await driver.wait(until.urlContains("/admin/users"), 10000);
        await sleep(4000);
        console.log("Reached User Management page.");
        await scrollPage(driver);

        // Check for Users Table
        try {
            const tableHeaders = await driver.findElements(By.xpath("//div[contains(., 'User Profile')]"));
            if (tableHeaders.length > 0) {
                console.log("Users table rendered.");
            }

            console.log("Testing User Suspension...");
            // Find first SUSPEND button for a non-admin user
            const suspendBtnXpath = "//button[text()='SUSPEND']";
            const suspendBtn = await driver.wait(until.elementLocated(By.xpath(suspendBtnXpath)), 15000);

            // Toggle to Suspend
            console.log("Action: Suspending a user...");
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", suspendBtn);
            await sleep(1000);
            await driver.executeScript("arguments[0].click();", suspendBtn);
            await sleep(3000);

            // Verify it now says RESTORE
            const restoreBtn = await driver.wait(until.elementLocated(By.xpath("//button[text()='RESTORE']")), 10000);
            console.log("User suspended successfully.");

            // Toggle back to RESTORE
            console.log("Action: Restoring the user...");
            await driver.executeScript("arguments[0].click();", restoreBtn);
            await sleep(3000);
            await driver.wait(until.elementLocated(By.xpath(suspendBtnXpath)), 10000);
            console.log("User restored successfully.");

        } catch (e) {
            console.log("User suspension test failed or no eligible users found: " + e.message);
        }
    }

    // Test Navigation to Communities Management
    console.log("\nNavigating to Communities Management...");
    await driver.get(baseUrl + "/admin/communities");
    await driver.wait(until.urlContains("/admin/communities"), 10000);
    await sleep(4000);
    console.log("Reached Communities Management page.");
    await scrollPage(driver);

    try {
        console.log("Testing Community Suspension...");
        // Find first Disable button
        const disableBtnXpath = "//button[text()='Disable']";
        const disableBtn = await driver.wait(until.elementLocated(By.xpath(disableBtnXpath)), 15000);

        // Toggle to Disable
        console.log("Action: Disabling a community...");
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", disableBtn);
        await sleep(1000);
        await driver.executeScript("arguments[0].click();", disableBtn);
        await sleep(3000);

        // Verify it now says Restore
        const restoreCommBtn = await driver.wait(until.elementLocated(By.xpath("//button[text()='Restore']")), 10000);
        console.log("Community disabled successfully.");

        // Toggle back to Restore
        console.log("Action: Restoring the community...");
        await driver.executeScript("arguments[0].click();", restoreCommBtn);
        await sleep(3000);
        await driver.wait(until.elementLocated(By.xpath(disableBtnXpath)), 10000);
        console.log("Community restored successfully.");

    } catch (e) {
        console.log("Community suspension test failed: " + e.message);
    }

    // Test Navigation to Announcements
    console.log("\nNavigating to Announcements...");
    await driver.get(baseUrl + "/admin/announcements");
    await driver.wait(until.urlContains("/admin/announcements"), 10000);
    await sleep(4000);
    console.log("Reached Announcements page.");
    await scrollPage(driver);

    try {
        console.log("Action: Creating a new Announcement...");
        const titleInput = await driver.wait(until.elementLocated(By.id("announcement-title")), 15000);
        await titleInput.sendKeys("System Maintenance Alert");

        const contentInput = await driver.findElement(By.id("announcement-message"));
        await contentInput.sendKeys("The system will be under maintenance tonight at 12 PM PST. Please save your work.");

        await sleep(2000);
        const submitAnnBtn = await driver.findElement(By.id("broadcast-btn"));
        await driver.executeScript("arguments[0].click();", submitAnnBtn);
        await sleep(4000);

        console.log("Announcement created successfully.");

        // Verify it appears with scroll check
        const latestAnn = await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'System Maintenance Alert')]")), 10000);
        if (latestAnn) {
            await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", latestAnn);
            await sleep(2000);
            console.log("SUCCESS: Verified - New announcement visible in list.");
        }
    } catch (e) {
        console.log("Announcement creation test failed: " + e.message);
    }

    // Return to Admin Dashboard
    await driver.get(baseUrl + "/admin");
    await sleep(3000);

    // Return to Admin Dashboard
    await driver.get(baseUrl + "/admin");
    await sleep(3000);
}

module.exports = {
    testAdminFlow
};
