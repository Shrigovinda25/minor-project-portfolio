const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

const pdfDir = '..'; // parent dir where PDFs are
const outputFile = 'extracted_papers.json';

async function parseAll() {
  const files = fs.readdirSync(pdfDir).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${files.length} PDFs.`);
  const results = {};

  for (const file of files) {
    const filePath = path.join(pdfDir, file);
    console.log(`Parsing ${file}...`);
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(dataBuffer);
      const parser = new PDFParse({ data: uint8Array });
      const data = await parser.getText();
      
      // Extract title: we will try to clean up the first few lines of text
      const lines = data.text.split('\n').map(l => l.trim()).filter(Boolean);
      let title = '';
      const titleLines = [];
      for (const line of lines.slice(0, 10)) {
        if (/abstract|author|email|university|department|vol\.|no\.|issn|proceedings|conference|arxiv/i.test(line)) {
          break;
        }
        titleLines.push(line);
      }
      title = titleLines.join(' ');

      // Extract abstract: look for abstract pattern
      let abstract = '';
      const match = data.text.match(/abstract[\s\S]{1,1500}(?=(introduction|keywords|i\.\s+intro|\n\s*[0-9]\s*\.))/i);
      if (match) {
        abstract = match[0].trim();
      } else {
        const idx = data.text.toLowerCase().indexOf('abstract');
        if (idx !== -1) {
          abstract = data.text.substring(idx, idx + 1200).trim();
        } else {
          abstract = data.text.substring(0, 1500).trim();
        }
      }

      results[file] = {
        title: title.substring(0, 300),
        abstract: abstract.substring(0, 1500),
        textSample: data.text.substring(0, 4000)
      };
    } catch (err) {
      console.error(`Error parsing ${file}:`, err.message);
      results[file] = { error: err.message };
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`Done! Saved results to ${outputFile}`);
}

parseAll();
