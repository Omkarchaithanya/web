const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    
    // Desktop View
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/index.html');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'C:/Users/omkar/.gemini/antigravity-ide/brain/88ef256a-d569-46b9-b178-58fd3310a8c9/desktop-top.png' });
    
    // Scroll down 1000px inside snap-container
    await page.evaluate(() => {
        document.querySelector('#snap-container').scrollBy(0, 1000);
    });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'C:/Users/omkar/.gemini/antigravity-ide/brain/88ef256a-d569-46b9-b178-58fd3310a8c9/desktop-scrolled.png' });
    
    // Mobile View
    const mobilePage = await browser.newPage();
    await mobilePage.setViewportSize({ width: 375, height: 667 });
    await mobilePage.goto('http://localhost:3000/index.html');
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: 'C:/Users/omkar/.gemini/antigravity-ide/brain/88ef256a-d569-46b9-b178-58fd3310a8c9/mobile-top.png' });
    
    // Scroll down 500px on mobile
    await mobilePage.evaluate(() => {
        const container = document.querySelector('#snap-container');
        if (container) container.scrollBy(0, 500);
        else window.scrollBy(0, 500);
    });
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: 'C:/Users/omkar/.gemini/antigravity-ide/brain/88ef256a-d569-46b9-b178-58fd3310a8c9/mobile-scrolled.png' });

    await browser.close();
})();
