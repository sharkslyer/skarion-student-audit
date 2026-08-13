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
  const minSecMatch = str.match(/(\d+)\s*minutes?\s*(\d+)?\s*seconds?/i);
  if (minSecMatch) {
    const mins = String(minSecMatch[1]).padStart(2, '0');
    const secs = String(minSecMatch[2] || '0').padStart(2, '0');
    return `${mins}:${secs}`;
  }
  const colonMatch = str.match(/(\d{1,2}):(\d{2})/);
  if (colonMatch) {
    const mins = String(colonMatch[1]).padStart(2, '0');
    const secs = String(colonMatch[2]).padStart(2, '0');
    return `${mins}:${secs}`;
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
  const isNoiseLine = (line) => /^\d+\s*minutes?\s*\d*\s*seconds?\d+:\d+$/i.test(line.trim());

  // Words that indicate a line is dialogue, NOT a speaker name
  const commonSpeechWords = ['hello', 'hi', 'yes', 'no', 'okay', 'ok', 'good', 'yeah', 'alright', 'thanks', 'thank', 'bye', 'welcome', 'sure'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Skip avatar initials lines (e.g. "AC", "M", "KA", "AB")
    if (isInitialsLine(line)) continue;
    // Skip duplicate Teams noise lines
    if (isNoiseLine(line)) continue;

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

    // Scenario B: Raw Teams header like "Ahmed Chowdhury 0 minutes 7 seconds" or "Md Ali Ahnaf Abid Mayukh 0 minutes 4 seconds"
    if (!detectedSpeaker && (/^[A-Za-z\s\.\-]{2,40}\s+\d+\s*minutes?/i.test(line) || /^[A-Za-z\s\.\-]{2,40}\s+\d+:\d{2}$/i.test(line))) {
      const parts = line.match(/^(.*?)\s*(\d+\s*minutes?.*|\d+:\d{2}.*)$/i);
      if (parts) {
        detectedSpeaker = cleanSpeakerName(parts[1]);
        detectedTime = extractTimestamp(parts[2]);
      }
    }

    // Scenario C: Standalone Name line like "Ahmed Chowdhury" followed by timestamp line
    if (!detectedSpeaker) {
      const candidateName = cleanSpeakerName(line);
      const isNotSpeechWord = !commonSpeechWords.includes(candidateName.toLowerCase());
      const isShortName = candidateName.length >= 2 && candidateName.length <= 35;
      const hasNoPunctuation = !/[\.\,\?\!\:\;]/.test(line);

      if (isShortName && isNotSpeechWord && hasNoPunctuation && !line.includes('minutes') && !/^\d+:\d{2}$/.test(line)) {
        // Look ahead to next non-empty line to see if it's a timestamp or dialogue
        let nextLine = '';
        for (let j = i + 1; j < Math.min(lines.length, i + 3); j++) {
          if (lines[j] && lines[j].trim()) {
            nextLine = lines[j].trim();
            break;
          }
        }
        if (nextLine && (extractTimestamp(nextLine) || isInitialsLine(nextLine) || lines.length > i + 1)) {
          detectedSpeaker = candidateName;
        }
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
      const timeOnly = extractTimestamp(line);
      if (timeOnly && line.length < 30 && !currentTimestamp) {
        currentTimestamp = timeOnly;
        continue;
      }

      if (line !== currentSpeaker && !line.includes('minutes') && !/^\d+:\d{2}$/.test(line)) {
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
      return `${b.speaker}${timeStr}: ${b.text}`;
    }).join('\n\n');
  }

  return rawText.trim();
}
