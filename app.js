const playwright = require('playwright');
const { default: axios } = require('axios');

URL = "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/ od-2014/q-actros? search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at %3Adesc";

// 2. Add getNextPageUrl function to iterate over pages
async function getNextPageUrl () {
    const browser = await playwright.chromium.launch({
        headless: false // setting this to true will not run the UI
    });
    const page = await browser.newPage();
    await page.goto(URL);
    await page.click('text=Akceptuję');
    await page.click('.ooa-sarnrm-stepperStylesOverrides-PaginationForwardsStepper');
    await page.waitForTimeout(10000); // wait for 10 seconds
    await browser.close();
}

// 3. Add addItems function that fetches item urls + item ids (unique ids that the portal uses) from list page
async function addItems () {
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
// 4. Add getTotalAdsCount function - shows how many total ads exist for the provided initial url
async function getTotalAdsCount  () {
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto(URL);

    const cars = await page.$$eval('.e1b25f6f18', all_items => {
        const data = [];
        all_items.forEach(car => {
            const name = car.querySelector('h2').innerText;
            data.push({
                name,
            });
        });
        return data;
    });
    var k = JSON.parse(JSON.stringify(cars));
    console.log('Total Count:', k.length);

    await browser.close();
}
// 5. Add scrapeTruckItem function - that scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power

async function scrapeTruckItem () {
    // const rp = require('request-promise');
    // const cheerio = require("cheerio");
    // const url = 'https://www.otomoto.pl/oferta/mercedes-benz-ciagnik-siodlowy-actros-1843-ls-ciagnik-siodlowy-mercedes-benz-actros-1843-ls-ID6Enf3j.html';
    // const { data } = await axios.get(url);
    // // Load HTML we fetched in the previous line
    // const $ = cheerio.load(data);
    // rp(url)
    // .then(function(html) {
    //     console.log('ID:',$('.offer-meta #ad_id', html).text());
    //     console.log('Title:',$('.fake-title', html).text());
    //     console.log('Price:',$('.offer-price__number', html).text());
    //     // console.log($('.bday', html).text());
    // })
    // .catch(function(err) {
    //     //handle error
    // });
}

// 6 Scrape all pages, all ads


async function Scrape_all_pages() {
    const { chromium } = require('playwright');
	const browser = await chromium.launch({
		headless: false // false if you can see the browser, default is true
	})
	const page = await browser.newPage()

	// Navigate and wait until network is idle
	await page.goto(URL, { waitUntil: 'networkidle' })

    await page.click('text=Akceptuję');
	// get the articles per page
	let articles = []

	let nextBtn = true
	let numPage = 1;
	while (nextBtn) {
		try {

			await page.waitForSelector('.e1b25f6f13 ');
			const articlesPerPage = await page.$$eval('.e1b25f6f13 ', headerArticle => {

				return headerArticle.map((article) => {

					const title = article.getElementsByTagName('a')[0].innerText
					const link = article.getElementsByTagName('a')[0].href

					return JSON.stringify({
						title,
						link
					})

				})

			})

			articles.push({
				page: numPage++,
				articles: articlesPerPage
			})

			// wait 4000ms
			await delay(2000);

			try {
				await page.waitForSelector('.ooa-sarnrm-stepperStylesOverrides-PaginationForwardsStepper');
			} catch (err) {
				nextBtn = false
			}

			if (nextBtn) {
				console.log('click Next page')
				// by clicking the Next button
				await page.click('.ooa-sarnrm-stepperStylesOverrides-PaginationForwardsStepper');
			}

		} catch (error) {
			console.log({ error })
		}
	}

	console.log(articles)

	// close page and browser
	await page.close()
	await browser.close()

};

// function to wait a while
function delay(time) {
	return new Promise(function (resolve) {
		setTimeout(resolve, time) 
	});
}

getNextPageUrl(); // 2.for  Next Page
addItems (); // 3.for  Items
getTotalAdsCount(); // 4.for  Total Count
scrapeTruckItem(); // 5.for  Item
Scrape_all_pages(); // 6.for  All Pages