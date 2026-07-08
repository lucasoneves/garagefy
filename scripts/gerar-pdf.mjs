import { chromium } from 'playwright-core';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '..', 'relatorio-mvp.html');
const pdfPath = path.resolve(__dirname, '..', 'relatorio-mvp.pdf');

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1280, height: 900 },
});

await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });

await page.pdf({
  path: pdfPath,
  format: 'A4',
  margin: { top: '20mm', bottom: '20mm' },
  printBackground: true,
  displayHeaderFooter: false,
});

await browser.close();
console.log(`PDF gerado: ${pdfPath}`);
