// const axios = require('axios');
// axios.get('https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/ od-2014/q-actros? search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at %3Adesc')
// 	.then(({ data }) => console.log(data));

const playwright = require('playwright');
async function main() {
    const browser = await playwright.chromium.launch({
        headless: false // setting this to true will not run the UI
    });

    const page = await browser.newPage();
    await page.goto('https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/ od-2014/q-actros? search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at %3Adesc');
    await page.click('text=Akceptuję');
    // await page.waitForFunction(() => {
    //     const repoCards = document.querySelectorAll('article.border');
    //     return repoCards.length > 30;
    // });
    await page.waitForTimeout(5000); // wait for 5 seconds
    await browser.close();
}

main();