const puppeteer = require('puppeteer');
const express = require('express');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'dist')));

const server = app.listen(port, async () => {
  console.log(`Server listening on port ${port}`);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the app
  await page.goto(`http://localhost:${port}`);
  
  // Wait for React to mount
  await page.waitForSelector('.auth-wrapper');
  
  // Login
  await page.type('input[type="text"]', '96966249510');
  await page.type('input[type="password"]', '9696');
  await page.click('button[type="submit"]');
  
  // OTP
  await page.waitForSelector('input[placeholder="Enter 4-digit OTP"]');
  await page.type('input[placeholder="Enter 4-digit OTP"]', '2026');
  await page.click('button[type="submit"]');
  
  // Fill form (just need some tests checked and Generate PDF)
  await page.waitForSelector('.form-container');
  // Wait a moment for rendering
  await new Promise(r => setTimeout(r, 1000));
  
  // Click Generate PDF button
  await page.click('button.btn-primary.btn-block');
  
  // Wait for preview to render
  await page.waitForSelector('.preview-container');
  await new Promise(r => setTimeout(r, 2000)); // wait for rendering
  
  // Generate PDF
  await page.pdf({
    path: 'test-output.pdf',
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false // Chrome does this when margin is 0, but since we have margin 4.5, we disable them here explicitly to simulate what user unchecking "Headers and footers" does
  });
  
  console.log('PDF generated at test-output.pdf');
  await browser.close();
  server.close();
});
