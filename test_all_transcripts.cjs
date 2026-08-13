const fs = require('fs');

const { parseAndOrganizeTranscript } = require('./src/utils/transcriptParser.js');

const initialDataText = fs.readFileSync('./src/data/initialData.js', 'utf8');

// Quick check for candidates in initialData.js
console.log('Testing transcript parser across all candidate mock sessions in initialData.js:');

const matches = initialDataText.match(/name:\s*'([^']+)'[\s\S]*?mockSessions:\s*\[([\s\S]*?)\]\s*,/g);
if (matches) {
  matches.forEach(m => {
    const nameMatch = m.match(/name:\s*'([^']+)'/);
    const transcriptMatch = m.match(/transcript:\s*`([\s\S]*?)`/);
    if (nameMatch && transcriptMatch) {
      const candidateName = nameMatch[1];
      const parsed = parseAndOrganizeTranscript(transcriptMatch[1], [candidateName]);
      const speakers = [...new Set(parsed.split('\n\n').map(b => b.split(' ')[0].replace(/[:\[].*$/, '')))];
      console.log(`- Candidate: ${candidateName} | Speakers Found:`, speakers);
    }
  });
}
