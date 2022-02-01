const playwright = require('playwright');

(async () => {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto('https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/ od-2014/q-actros? search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at %3Adesc');
    const cars = await page.$$eval('.e1b25f6f18', all_items => {
        const data = [];
        all_items.forEach(car => {
            // const id = car.evaluate(el => el.id, article);
            const name = car.querySelector('h2').innerText;
            const link = car.querySelector('h2 > a').href;
            data.push({
                // id,
                name,
                link
            });
        });
        return data;
    });
    console.log(cars);
    var k = JSON.parse(JSON.stringify(cars));
    console.log(k.length);

    await browser.close();
})();