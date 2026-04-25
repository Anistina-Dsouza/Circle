const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testDriver() {
    console.log('Testing WebDriver Build...');
    let driver;
    try {
        const options = new chrome.Options();
        options.addArguments('--window-size=1280,800');
        // options.addArguments('--headless'); // Try headless if regular fails
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        console.log('✅ Driver built successfully!');
        await driver.get('https://www.google.com');
        const title = await driver.getTitle();
        console.log('Page Title:', title);
    } catch (err) {
        console.error('❌ Driver build failed:', err.message);
        console.error('Stack Trace:', err.stack);
    } finally {
        if (driver) await driver.quit();
    }
}

testDriver();
