const fs = require('fs');
const data = require('./extracted_papers.json');

let markdown = '# Summaries of 28 PDFs\n\n';

for (let file of Object.keys(data).sort((a,b) => parseInt(a) - parseInt(b))) {
  const paper = data[file];
  markdown += `## ${file}\n`;
  if (paper.error) {
    markdown += `**Error:** ${paper.error}\n\n`;
    continue;
  }
  
  markdown += `**Raw Title Area:** ${paper.title.trim()}\n\n`;
  markdown += `**Abstract Preview:**\n${paper.abstract.trim()}\n\n`;
  markdown += `**First 2000 chars of text:**\n\`\`\`text\n${paper.textSample.substring(0, 2000).replace(/`/g, "'")}\n\`\`\`\n\n`;
  markdown += `---\n\n`;
}

fs.writeFileSync('C:\\Users\\shrig\\.gemini\\antigravity-ide\\brain\\c3b97e6a-f21b-406e-a5fb-b1fade3156f3\\scratch\\pdf_summaries.md', markdown);
console.log('Done writing pdf_summaries.md');
