const { INITIAL_STUDENTS } = require('./src/data/initialData.js');
const { parseAndOrganizeTranscript } = require('./src/utils/transcriptParser.js');

console.log('Testing transcript parser across all candidates in initialData.js...');

INITIAL_STUDENTS.forEach(student => {
  if (student.mockSessions && student.mockSessions.length > 0) {
    student.mockSessions.forEach((session, idx) => {
      if (session.transcript) {
        const parsed = parseAndOrganizeTranscript(session.transcript, INITIAL_STUDENTS.map(s => s.name));
        const speakers = [...new Set(parsed.split('\n\n').map(b => b.split(' ')[0].replace(/[:\[].*$/, '')))];
        console.log(`Candidate: ${student.name} (Session ${idx + 1}) | Speakers Found:`, speakers);
      }
    });
  }
});
