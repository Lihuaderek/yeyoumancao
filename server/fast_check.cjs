const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));
  await page.goto('http://localhost:3001');
  await new Promise(r => setTimeout(r, 2000));
  console.log('Root content length:', await page.$eval('#root', el => el.innerHTML.length).catch(()=>'No root'));
  await browser.close();
  process.exit(0);
})();
