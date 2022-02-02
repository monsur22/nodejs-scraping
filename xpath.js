const playwright = require('playwright');
async function main() {
    const browser = await playwright.chromium.launch({
        headless: false
    });

    const page = await browser.newPage();
    await page.goto('https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/ od-2014/q-actros? search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at %3Adesc');


    const id = await page.$eval('xpath=//html/body/div[1]/div/div/div/div[2]/div[2]/div[2]/div[1]/div[3]/main',
        navElm => {
            let refs = []
            let atags = navElm.getElementsByTagName("article");
            for (let item of atags) {
                refs.push(item.id);
            }
            return refs;
    });
    const link = await page.$$eval('.e1b25f6f18', all_items => {
            const data = [];
            all_items.forEach(car => {
                const link = car.querySelector('h2 > a').href;
                data.push({
                    link
                });
            });
            return data;
    });

    console.log('ID', id);
    console.log('Link', link);
    await page.waitForTimeout(5000); // wait
    await browser.close();
}

main();