const playwright = require('playwright');
    async function main() {
        const browser = await playwright.chromium.launch({
            headless: false
        });

        const page = await browser.newPage();
        await page.goto('https://stackoverflow.blog/');
        const xpathData = await page.$eval('xpath=//html/body/div/header/nav',
            navElm => {
                let refs = []
                let atags = navElm.getElementsByTagName("a");
                // for (let item of atags) {
                //     refs.push(item.href);
                // }
                console.log(atags);
                return refs;
            });

        console.log('StackOverflow Links', xpathData);
        await page.waitForTimeout(5000); // wait
        await browser.close();
    }

    main();