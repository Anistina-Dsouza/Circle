const { By, until, Key } = require('selenium-webdriver');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Standard Wait Helper
 * Ensures element is on page, visible, enabled, and centered.
 */
async function waitForInteractable(driver, locator, timeout = 25000) {
    try {
        const element = await driver.wait(until.elementLocated(locator), timeout);
        await driver.wait(until.elementIsVisible(element), 15000);
        await driver.wait(async () => await element.isEnabled(), 15000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
        await sleep(1500);
        return element;
    } catch (error) {
        throw new Error(`Critical element missing or hidden: ${locator.toString()}`);
    }
}

/**
 * Edge Case Handler (Non-Fatal)
 * If an element doesn't exist, logs a warning instead of crashing the test.
 */
async function safeAction(driver, locator, actionName, timeout = 10000) {
    try {
        const element = await driver.wait(until.elementLocated(locator), timeout);
        await driver.wait(until.elementIsVisible(element), 5000);
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
        console.log(`SUCCESS: ${actionName} found.`);
        return element;
    } catch (e) {
        console.log(`SKIP: ${actionName} - Not present or not required at this moment.`);
        return null;
    }
}

/**
 * Humanized Typing with React Buffer Management
 */
async function type(driver, locator, text) {
    const element = await waitForInteractable(driver, locator);
    for (const char of text) {
        await element.sendKeys(char);
        await sleep(120);
    }
}

async function typeWithEnter(driver, locator, text) {
    const element = await waitForInteractable(driver, locator);
    for (const char of text) {
        await element.sendKeys(char);
        await sleep(120);
    }
    await sleep(500);
    await element.sendKeys(Key.ENTER);
}

/**
 * Robust Input Clear for React Controlled Components
 */
async function clearAndType(driver, locator, text) {
    const element = await waitForInteractable(driver, locator);
    await element.sendKeys(Key.CONTROL, "a");
    await element.sendKeys(Key.BACK_SPACE);
    await sleep(400);
    
    // Safety check: standard clear
    const val = await element.getAttribute('value');
    if (val && val.length > 0) await element.clear();

    for (const char of text) {
        await element.sendKeys(char);
        await sleep(120);
    }
}

async function click(driver, selector) {
    const locator = (typeof selector === 'string') ? By.css(selector) : selector;
    const element = await waitForInteractable(driver, locator);
    await sleep(2000);
    try {
        await element.click();
    } catch (e) {
        await driver.executeScript("arguments[0].click();", element);
    }
}

async function safeClickText(driver, text) {
    try {
        const xpath = `//button[contains(.,'${text}')] | //a[contains(.,'${text}')] | //span[contains(.,'${text}')]`;
        const btn = await waitForInteractable(driver, By.xpath(xpath));
        await sleep(2000);
        try {
            await btn.click();
        } catch (e) {
            await driver.executeScript("arguments[0].click();", btn);
        }
        console.log(`SUCCESS: Interaction - ${text}`);
    } catch (e) {
        console.log(`SKIP: ${text} not found. Continuing test...`);
    }
}

const HUMAN_NAMES = [
    "Alex Rivera", "Sarah Miller", "John Doe", "Emily Chen", 
    "Michael Brown", "Jessica Wong", "David Smith", "Lisa Garcia"
];

const HUMAN_MESSAGES = [
    "Hey! Just checking out this awesome platform. Love the design!",
    "Hi there, could you tell me more about the upcoming circle events?",
    "Hello! I'm interested in joining the tech discussions here.",
    "Great work on the Circle project, everything looks very smooth.",
    "Checking in to see if the meeting is still happening as scheduled."
];

function getRandomIdentity() {
    const name = HUMAN_NAMES[Math.floor(Math.random() * HUMAN_NAMES.length)];
    const id = Date.now().toString().slice(-4);
    const username = name.toLowerCase().replace(" ", "_") + id;
    const email = `${username}@example.com`;
    return { name, username, email };
}

function getRandomMessage() {
    return HUMAN_MESSAGES[Math.floor(Math.random() * HUMAN_MESSAGES.length)];
}

module.exports = {
    sleep,
    type,
    typeWithEnter,
    clearAndType,
    click,
    safeClickText,
    getRandomIdentity,
    getRandomMessage,
    waitForInteractable,
    safeAction
};
