/**
 * Smart Transcript Auto-Organizer Utility
 * Cleans and formats raw meeting copy-pastes (MS Teams, Google Meet, Zoom, etc.)
 */

export function parseAndOrganizeTranscript(rawText) {
  if (!rawText || !rawText.trim()) return '';

  const lines = rawText.split('\n');
  const blocks = [];
  let currentSpeaker = '';
  let currentTimestamp = '';
  let currentLines = [];

  const cleanSpeakerName = (name) => {
    if (!name) return '';
    const cleaned = name.replace(/\d+.*$/, '').replace(/[\(\)\[\]:]/g, '').trim();
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
    
    const parts = cleaned.split(/\s+/).filter(p => !['md', 'ali', 'ahnaf', 'abid', 'hasan', 'akash', 'bhattacharjee', 'mahmud', 'ahmad'].includes(p.toLowerCase()));
    return parts[0] || cleaned;
  };

  const extractTimestamp = (str) => {
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
  };

  const isInitialsLine = (line) => /^[A-Z]{1,3}$/.test(line.trim());
  const isNoiseLine = (line) => /^\d+\s*minutes?\s*\d*\s*seconds?\d+:\d+$/i.test(line.trim());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (isInitialsLine(line)) continue;
    if (isNoiseLine(line)) continue;

    let detectedSpeaker = '';
    let detectedTime = '';
    let contentAfterHeader = '';

    // Scenario A: Formatted dialogue like "Mayukh [00:04]: Dialogue content..." or "Mayukh: Dialogue content..."
    const formattedMatch = line.match(/^([^:\[\n]+)(?:\s*\[(\d{1,2}:\d{2})\])?\s*:(.*)$/);
    if (formattedMatch) {
      const possibleSpeaker = cleanSpeakerName(formattedMatch[1]);
      const known = ['Mayukh', 'Avirup', 'Faisal', 'Ferdous', 'Kasshaf', 'Piyas', 'Saki', 'Interviewer', 'Candidate'].includes(possibleSpeaker);
      if (known) {
        detectedSpeaker = possibleSpeaker;
        detectedTime = formattedMatch[2] || '';
        contentAfterHeader = formattedMatch[3].trim();
      }
    }

    // Scenario B: Raw Teams header like "Md Ali Ahnaf Abid Mayukh 0 minutes 4 seconds"
    if (!detectedSpeaker && (/^\D+\s+\d+\s*minutes?/i.test(line) || /^\D+\s+\d+:\d{2}$/i.test(line))) {
      const parts = line.match(/^(.*?)\s*(\d+\s*minutes?.*|\d+:\d{2}.*)$/i);
      if (parts) {
        detectedSpeaker = cleanSpeakerName(parts[1]);
        detectedTime = extractTimestamp(parts[2]);
      }
    }

    // Scenario C: Line is just a speaker name line like "Md Ali Ahnaf Abid Mayukh"
    if (!detectedSpeaker) {
      const possibleName = cleanSpeakerName(line);
      const isKnown = ['Mayukh', 'Avirup', 'Faisal', 'Ferdous', 'Kasshaf', 'Piyas', 'Saki', 'Interviewer', 'Candidate'].includes(possibleName);
      if (isKnown && !line.includes('minutes') && !/^\d+:\d{2}$/.test(line) && line.length < 40) {
        detectedSpeaker = possibleName;
      }
    }

    if (detectedSpeaker) {
      if (currentSpeaker && currentLines.length > 0) {
        const fullText = currentLines.join(' ').trim();
        if (fullText) {
          if (blocks.length > 0 && blocks[blocks.length - 1].speaker === currentSpeaker) {
            blocks[blocks.length - 1].text += ' ' + fullText;
          } else {
            blocks.push({
              speaker: currentSpeaker,
              timestamp: currentTimestamp,
              text: fullText
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
    const fullText = currentLines.join(' ').trim();
    if (fullText) {
      if (blocks.length > 0 && blocks[blocks.length - 1].speaker === currentSpeaker) {
        blocks[blocks.length - 1].text += ' ' + fullText;
      } else {
        blocks.push({
          speaker: currentSpeaker,
          timestamp: currentTimestamp,
          text: fullText
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
