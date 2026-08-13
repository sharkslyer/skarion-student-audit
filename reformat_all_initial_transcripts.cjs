const fs = require('fs');

function cleanSpeakerName(name) {
  if (!name) return '';
  let cleaned = name.replace(/\d+.*$/, '').replace(/[\(\)\[\]:]/g, '').trim();
  const lower = cleaned.toLowerCase();
  
  if (lower.includes('mayukh')) return 'Mayukh';
  if (lower.includes('avirup')) return 'Avirup';
  if (lower.includes('faisal')) return 'Faisal';
  if (lower.includes('ferdous')) return 'Ferdous';
  if (lower.includes('kasshaf')) return 'Kasshaf';
  if (lower.includes('piyas')) return 'Piyas';
  if (lower.includes('saki')) return 'Saki';
  if (lower.includes('tashfia')) return 'Tashfia';
  
  // Clean prefix title like Md, MD, Mr, Ms
  cleaned = cleaned.replace(/^(md|mr|ms|mrs|dr)\.?\s+/i, '');
  const parts = cleaned.split(/\s+/).filter(p => !['md', 'ali', 'ahnaf', 'abid', 'hasan', 'akash', 'bhattacharjee', 'mahmud', 'ahmad', 'azmain', 'chowdhury', 'roy', 'alam'].includes(p.toLowerCase()));
  return parts[0] || cleaned;
}

function parseAndOrganizeTranscriptUniversal(rawText) {
  if (!rawText || !rawText.trim()) return '';

  const lines = rawText.split('\n');
  const blocks = [];
  let currentSpeaker = '';
  let currentTimestamp = '';
  let currentLines = [];

  const isSystemMetadataLine = (line) => {
    if (!line) return false;
    const lower = line.toLowerCase().trim();
    return (
      lower.includes('meeting recording') ||
      lower.includes('started transcription') ||
      lower.includes('stopped transcription') ||
      lower.includes('started recording') ||
      lower.includes('stopped recording') ||
      lower.includes('joined the meeting') ||
      lower.includes('left the meeting') ||
      /^\d{1,2}m\s*\d{1,2}s$/i.test(lower) ||
      /^\d{1,2}h\s*\d{1,2}m(?:\s*\d{1,2}s)?$/i.test(lower) ||
      /^(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},\s+\d{4}/i.test(lower)
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (isSystemMetadataLine(line)) continue;

    let detectedSpeaker = '';
    let detectedTime = '';
    let contentAfterHeader = '';

    // Pattern 1: Formatted line "Speaker [MM:SS]: Dialogue" or "Speaker: Dialogue"
    const formattedMatch = line.match(/^([^:\[\n]{2,35})(?:\s*\[(\d{1,2}:\d{2}(?::\d{2})?)\])?\s*:(.*)$/);
    if (formattedMatch) {
      const candidateName = cleanSpeakerName(formattedMatch[1]);
      if (candidateName && candidateName.length >= 2) {
        detectedSpeaker = candidateName;
        detectedTime = formattedMatch[2] || '';
        contentAfterHeader = formattedMatch[3].trim();
      }
    }

    // Pattern 2: MS Teams header line "Speaker Name   0:03" or "Speaker Name   1:00:18"
    if (!detectedSpeaker && (/^[A-Za-z\s\.\-]{2,45}\s+\d+(?::\d{2}){1,2}$/i.test(line) || /^[A-Za-z\s\.\-]{2,45}\s+\d+\s*minutes?/i.test(line))) {
      const parts = line.match(/^(.*?)\s+(\d+(?::\d{2}){1,2}|\d+\s*minutes?.*)$/i);
      if (parts) {
        const candidateName = cleanSpeakerName(parts[1]);
        if (candidateName && candidateName.length >= 2) {
          detectedSpeaker = candidateName;
          detectedTime = parts[2];
        }
      }
    }

    if (detectedSpeaker) {
      if (currentSpeaker && currentLines.length > 0) {
        const textContent = currentLines.join(' ').trim();
        if (textContent) {
          if (blocks.length > 0 && blocks[blocks.length - 1].speaker === currentSpeaker) {
            blocks[blocks.length - 1].text += ' ' + textContent;
          } else {
            blocks.push({
              speaker: currentSpeaker,
              timestamp: currentTimestamp,
              text: textContent
            });
          }
        }
        currentLines = [];
      }

      currentSpeaker = detectedSpeaker;
      if (detectedTime) currentTimestamp = detectedTime;
      if (contentAfterHeader) {
        currentLines.push(contentAfterHeader);
      }
    } else {
      if (currentSpeaker && !isSystemMetadataLine(line)) {
        currentLines.push(line);
      }
    }
  }

  if (currentSpeaker && currentLines.length > 0) {
    const textContent = currentLines.join(' ').trim();
    if (textContent) {
      if (blocks.length > 0 && blocks[blocks.length - 1].speaker === currentSpeaker) {
        blocks[blocks.length - 1].text += ' ' + textContent;
      } else {
        blocks.push({
          speaker: currentSpeaker,
          timestamp: currentTimestamp,
          text: textContent
        });
      }
    }
  }

  if (blocks.length > 0) {
    return blocks.map(b => {
      const timeStr = b.timestamp ? ` [${b.timestamp}]` : '';
      const cleanText = b.text.replace(/^\d{1,2}\s+/, '').replace(/^\[\d{1,2}:\d{2}(?::\d{2})?\]:?\s*/, '').trim();
      return `${b.speaker}${timeStr}: ${cleanText}`;
    }).join('\n\n');
  }

  return rawText.trim();
}

const filePath = './src/data/initialData.js';
let content = fs.readFileSync(filePath, 'utf8');

// Regex replace all raw transcript strings in initialData.js with clean organized chat blocks
let updatedCount = 0;
content = content.replace(/transcript:\s*`([\s\S]*?)`/g, (fullMatch, rawText) => {
  const cleaned = parseAndOrganizeTranscriptUniversal(rawText);
  updatedCount++;
  return `transcript: ${JSON.stringify(cleaned)}`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log(`Successfully reformatted all ${updatedCount} mock transcripts in initialData.js!`);
