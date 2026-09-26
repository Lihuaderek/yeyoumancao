const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
    });
    page.on('pageerror', error => errors.push('PAGE ERROR: ' + error.message));
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('--- ERRORS ---');
    console.log(errors.join('\n'));
    console.log('--------------');
    
    const rootHtml = await page.$eval('#root', el => el.innerHTML);
    console.log('Root HTML length:', rootHtml.length);
    
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Puppeteer Script Error:', err);
    process.exit(1);
  }
})();
