const puppeteer = require('puppeteer');
const path = require('path');

async function convertToPDF() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Load the HTML file
    const htmlPath = path.join(__dirname, 'invoice-tuku-cg-002.html');
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    await page.pdf({
        path: 'invoice-tuku-cg-002.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            right: '20px',
            bottom: '20px',
            left: '20px'
        }
    });
    
    await browser.close();
    console.log('PDF generated successfully: invoice-tuku-cg-002.pdf');
}

convertToPDF().catch(console.error);