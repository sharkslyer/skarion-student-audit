/**
 * Smart Transcript Auto-Organizer Utility
 * Cleans and formats raw meeting copy-pastes (MS Teams, Google Meet, Zoom, etc.)
 */

export function cleanSpeakerName(name) {
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
  if (lower.includes('interviewer')) return 'Interviewer';
  if (lower.includes('candidate')) return 'Candidate';
  
  // Clean prefix title like Md, MD, Mr, Ms
  cleaned = cleaned.replace(/^(md|mr|ms|mrs|dr)\.?\s+/i, '');
  return cleaned.trim();
}

export function extractTimestamp(str) {
  if (!str) return '';
  const s = str.trim();

  // Pattern 1: "0 minutes 4 seconds"
  const minSecMatch = s.match(/(\d+)\s*minutes?\s*(\d+)?\s*seconds?/i);
  if (minSecMatch) {
    const mins = String(minSecMatch[1]).padStart(2, '0');
    const secs = String(minSecMatch[2] || '0').padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Pattern 2: "12:35" or "0:04" or "1:03"
  const colonMatch = s.match(/(\d{1,2}):(\d{2})/);
  if (colonMatch) {
    const mins = String(colonMatch[1]).padStart(2, '0');
    const secs = String(colonMatch[2]).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Pattern 3: Standalone seconds count like "04", "07", "08", "09", "11", "14", "18", "28", "40"
  if (/^\d{1,2}$/.test(s)) {
    const secs = String(s).padStart(2, '0');
    return `00:${secs}`;
  }

  return '';
}

export function parseAndOrganizeTranscript(rawText) {
  if (!rawText || !rawText.trim()) return '';

  const lines = rawText.split('\n');
  const blocks = [];
  let currentSpeaker = '';
  let currentTimestamp = '';
  let currentLines = [];

  const isInitialsLine = (line) => /^[A-Z]{1,3}$/.test(line.trim());
  const isTimestampLine = (line) => {
    if (!line) return false;
    const s = line.trim();
    return /^\d{1,2}$/.test(s) || 
           /^\d{1,2}:\d{2}$/.test(s) || 
           /^\d+\s*minutes?\s*\d*\s*seconds?/i.test(s) ||
           /^\d+\s*minutes?\s*\d*\s*seconds?\d+:\d+$/i.test(s);
  };

  const commonSpeechWords = ['hello', 'hi', 'yes', 'no', 'okay', 'ok', 'good', 'yeah', 'alright', 'thanks', 'thank', 'bye', 'welcome', 'sure'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip avatar initials lines (e.g. "AC", "M", "KA", "AB")
    if (isInitialsLine(line)) continue;

    // If line is pure timestamp line (e.g. "04", "07", "0:04", "12:35", "0 minutes 4 seconds")
    if (isTimestampLine(line)) {
      const ts = extractTimestamp(line);
      if (ts) currentTimestamp = ts;
      continue;
    }

    let detectedSpeaker = '';
    let detectedTime = '';
    let contentAfterHeader = '';

    // Scenario A: Formatted line like "Name [MM:SS]: Dialogue..." or "Name: Dialogue..."
    const formattedMatch = line.match(/^([^:\[\n]{2,35})(?:\s*\[(\d{1,2}:\d{2})\])?\s*:(.*)$/);
    if (formattedMatch) {
      const candidateName = cleanSpeakerName(formattedMatch[1]);
      if (candidateName && candidateName.length >= 2 && !commonSpeechWords.includes(candidateName.toLowerCase())) {
        detectedSpeaker = candidateName;
        detectedTime = formattedMatch[2] || '';
        contentAfterHeader = formattedMatch[3].trim();
      }
    }

    // Scenario B: Raw Teams header line like "Ahmed Chowdhury 0 minutes 7 seconds" or "Md Ali Ahnaf Abid Mayukh 0:04"
    if (!detectedSpeaker && (/^[A-Za-z\s\.\-]{2,40}\s+\d+\s*minutes?/i.test(line) || /^[A-Za-z\s\.\-]{2,40}\s+\d+:\d{2}$/i.test(line))) {
      const parts = line.match(/^(.*?)\s*(\d+\s*minutes?.*|\d+:\d{2}.*)$/i);
      if (parts) {
        detectedSpeaker = cleanSpeakerName(parts[1]);
        detectedTime = extractTimestamp(parts[2]);
      }
    }

    // Scenario C: Standalone Name line like "Ahmed Chowdhury" or "Md Ali Ahnaf Abid Mayukh"
    if (!detectedSpeaker) {
      const candidateName = cleanSpeakerName(line);
      const isNotSpeechWord = !commonSpeechWords.includes(candidateName.toLowerCase());
      const isShortName = candidateName.length >= 2 && candidateName.length <= 35;
      const hasNoPunctuation = !/[\.\,\?\!\:\;]/.test(line);

      if (isShortName && isNotSpeechWord && hasNoPunctuation) {
        detectedSpeaker = candidateName;
      }
    }

    if (detectedSpeaker) {
      // Flush previous speaker's dialogue block
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
      if (line !== currentSpeaker && !isTimestampLine(line)) {
        currentLines.push(line);
      }
    }
  }

  // Push last block
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
      const cleanText = b.text.replace(/^\d{1,2}\s+/, '').replace(/^\[\d{1,2}:\d{2}\]:?\s*/, '').trim();
      return `${b.speaker}${timeStr}: ${cleanText}`;
    }).join('\n\n');
  }

  return rawText.trim();
}
