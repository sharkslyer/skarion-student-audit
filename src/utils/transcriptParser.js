/**
 * Smart Transcript Auto-Organizer Utility
 * Strict Header-Based MS Teams & Zoom Transcript Parser
 * Evaluator Whitelist: Kasshaf, Faisal, Saki, Ferdous, Piyas, Mayukh, Tashfia
 * Candidate Whitelist: Active Candidate Roster Names (Bhaskar, Maahir, Ahmed, etc.)
 */

const ALLOWED_EVALUATOR_NAMES = [
  'kasshaf', 'faisal', 'saki', 'ferdous', 'piyas', 'mayukh', 'tashfia'
];

const DEFAULT_CANDIDATE_ROSTER_NAMES = [
  'bhaskar', 'bhashkar', 'maahir', 'mahir', 'ahmed', 'ananya', 'avirup', 'rahul', 'fatima', 'tanvir', 'zayn',
  'ahasanul', 'tahmeed', 'sadman', 'yulun'
];

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
  if (lower.includes('tashfia')) return 'Tashfia';
  if (lower.includes('bhaskar') || lower.includes('bhashkar')) return 'Bhaskar';
  if (lower.includes('maahir') || lower.includes('mahir')) return 'Maahir';
  if (lower.includes('ahmed')) return 'Ahmed';
  if (lower.includes('ananya')) return 'Ananya';
  if (lower.includes('rahul')) return 'Rahul';
  if (lower.includes('fatima')) return 'Fatima';
  if (lower.includes('tanvir')) return 'Tanvir';
  if (lower.includes('zayn')) return 'Zayn';
  if (lower.includes('ahasanul')) return 'Ahasanul';
  if (lower.includes('tahmeed')) return 'Tahmeed';
  if (lower.includes('sadman')) return 'Sadman';
  if (lower.includes('yulun')) return 'Yulun';
  
  // Clean prefix title like Md, MD, Mr, Ms
  cleaned = cleaned.replace(/^(md|mr|ms|mrs|dr)\.?\s+/i, '');
  const parts = cleaned.split(/\s+/).filter(p => !['md', 'ali', 'ahnaf', 'abid', 'hasan', 'akash', 'bhattacharjee', 'mahmud', 'ahmad', 'azmain', 'chowdhury', 'roy'].includes(p.toLowerCase()));
  return parts[0] || cleaned;
}

export function isWhitelistedSpeaker(rawSpeakerName, extraCandidateNames = []) {
  if (!rawSpeakerName) return false;
  const cleaned = cleanSpeakerName(rawSpeakerName).toLowerCase().trim();
  if (!cleaned || cleaned.length < 2) return false;

  // 1. Check against Evaluator Whitelist
  if (ALLOWED_EVALUATOR_NAMES.some(e => cleaned === e || (e.length >= 3 && cleaned.includes(e)))) {
    return true;
  }

  // 2. Check against Candidate Roster Names
  const candidateWhitelist = [
    ...DEFAULT_CANDIDATE_ROSTER_NAMES,
    ...extraCandidateNames.map(n => cleanSpeakerName(n).toLowerCase().trim())
  ];

  if (candidateWhitelist.some(c => c === cleaned || (c.length >= 3 && cleaned.includes(c)))) {
    return true;
  }

  return false;
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

  // Pattern 2: "12:35" or "0:04" or "1:00:18"
  const colonMatch = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (colonMatch) {
    if (colonMatch[3]) {
      return `${colonMatch[1]}:${colonMatch[2]}:${colonMatch[3]}`;
    }
    const mins = String(colonMatch[1]).padStart(2, '0');
    const secs = String(colonMatch[2]).padStart(2, '0');
    return `${mins}:${secs}`;
  }

  // Pattern 3: Standalone seconds count like "04", "07"
  if (/^\d{1,2}$/.test(s)) {
    const secs = String(s).padStart(2, '0');
    return `00:${secs}`;
  }

  return '';
}

export function parseAndOrganizeTranscript(rawText, extraCandidateNames = []) {
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

    // Skip system metadata header/footer lines
    if (isSystemMetadataLine(line)) continue;

    let detectedSpeaker = '';
    let detectedTime = '';
    let contentAfterHeader = '';

    // Pattern 1: Explicit Formatted line like "Speaker [MM:SS]: Dialogue..." or "Speaker: Dialogue..."
    const formattedMatch = line.match(/^([^:\[\n]{2,35})(?:\s*\[(\d{1,2}:\d{2}(?::\d{2})?)\])?\s*:(.*)$/);
    if (formattedMatch) {
      const candidateName = cleanSpeakerName(formattedMatch[1]);
      if (isWhitelistedSpeaker(candidateName, extraCandidateNames)) {
        detectedSpeaker = candidateName;
        detectedTime = formattedMatch[2] || '';
        contentAfterHeader = formattedMatch[3].trim();
      }
    }

    // Pattern 2: Explicit MS Teams header line like "Bhaskar Roy   0:03" or "Md Ali Ahnaf Abid Mayukh   0:03" or "Kasshaf Ahmad   1:00:18"
    if (!detectedSpeaker && (/^[A-Za-z\s\.\-]{2,45}\s+\d+(?::\d{2}){1,2}$/i.test(line) || /^[A-Za-z\s\.\-]{2,45}\s+\d+\s*minutes?/i.test(line))) {
      const parts = line.match(/^(.*?)\s+(\d+(?::\d{2}){1,2}|\d+\s*minutes?.*)$/i);
      if (parts) {
        const candidateName = cleanSpeakerName(parts[1]);
        if (isWhitelistedSpeaker(candidateName, extraCandidateNames)) {
          detectedSpeaker = candidateName;
          detectedTime = extractTimestamp(parts[2]);
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
      if (currentSpeaker && !isSystemMetadataLine(line)) {
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
      const cleanText = b.text.replace(/^\d{1,2}\s+/, '').replace(/^\[\d{1,2}:\d{2}(?::\d{2})?\]:?\s*/, '').trim();
      return `${b.speaker}${timeStr}: ${cleanText}`;
    }).join('\n\n');
  }

  return rawText.trim();
}
