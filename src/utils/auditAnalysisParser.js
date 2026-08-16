/**
 * Executive Candidate Performance Metrics & Feedback Parser
 * Converts structured audit analysis text into a clean, rich JSON object
 * for stunning visual presentation in Mock Hub & Candidate Analytics Deep Dive.
 */

export function parseAuditAnalysis(rawText) {
  if (!rawText || typeof rawText !== 'string' || !rawText.trim()) {
    return null;
  }

  const cleanText = rawText.trim();
  const lines = cleanText.split(/\r?\n/);

  const result = {
    candidateName: '',
    targetRole: '',
    overallScore: null,
    overallSummary: '',
    metrics: [],
    strengths: [],
    weaknesses: [],
    actionItems: [],
    rawText: cleanText
  };

  let currentSection = 'HEADER'; // 'HEADER' | 'METRICS' | 'STRENGTHS' | 'WEAKNESSES' | 'ACTIONS' | 'OTHER'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const lower = line.toLowerCase();

    // 1. Detect Section Headers
    if (lower.startsWith('candidate:') || lower.startsWith('candidate name:')) {
      result.candidateName = line.split(':')[1]?.trim() || '';
      continue;
    }
    if (lower.startsWith('target role:') || lower.startsWith('role:') || lower.startsWith('applied role:')) {
      result.targetRole = line.split(':')[1]?.trim() || '';
      continue;
    }
    if (lower.startsWith('overall assessment:') || lower.startsWith('overall score:') || lower.startsWith('assessment:')) {
      const content = line.substring(line.indexOf(':') + 1).trim();
      const scoreMatch = content.match(/(\d+(?:\.\d+)?)\s*(?:\/\s*(\d+))?/);
      if (scoreMatch) {
        result.overallScore = parseFloat(scoreMatch[1]);
      }
      // Extract summary in parentheses or following text
      const parenMatch = content.match(/\((.*?)\)/);
      if (parenMatch) {
        result.overallSummary = parenMatch[1].trim();
      } else {
        result.overallSummary = content.replace(/\d+(?:\.\d+)?\s*\/\s*\d+/, '').replace(/^[\s\-:,]+/, '').trim();
      }
      continue;
    }

    if (lower.includes('performance metrics') || lower.includes('evaluation metrics') || lower.includes('scoring breakdown')) {
      currentSection = 'METRICS';
      continue;
    }
    if (lower.includes('strengths') || lower.includes('key strengths') || lower.includes('what went well') || lower.includes('pros:')) {
      currentSection = 'STRENGTHS';
      continue;
    }
    if (lower.includes('critical weaknesses') || lower.includes('weaknesses') || lower.includes('areas for improvement') || lower.includes('misconceptions') || lower.includes('mistakes')) {
      currentSection = 'WEAKNESSES';
      continue;
    }
    if (lower.includes('action items') || lower.includes('mentor action') || lower.includes('recommendations') || lower.includes('next steps') || lower.includes('remediation')) {
      currentSection = 'ACTIONS';
      continue;
    }

    // 2. Parse Section Items
    if (currentSection === 'METRICS') {
      // Example: * Communication & Delivery: 9 / 10 (Articulate, steady pacing, zero hesitation, highly professional tone)
      const metricLine = line.replace(/^[\*\-\•\d+\.]\s*/, '').trim();
      if (!metricLine) continue;

      const colonIdx = metricLine.indexOf(':');
      if (colonIdx > 0) {
        const name = metricLine.substring(0, colonIdx).trim();
        const rest = metricLine.substring(colonIdx + 1).trim();

        const scoreMatch = rest.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+)/);
        let score = null;
        let maxScore = 10;
        if (scoreMatch) {
          score = parseFloat(scoreMatch[1]);
          maxScore = parseFloat(scoreMatch[2]) || 10;
        }

        let note = '';
        const parenMatch = rest.match(/\((.*?)\)/);
        if (parenMatch) {
          note = parenMatch[1].trim();
        } else {
          note = rest.replace(/\d+(?:\.\d+)?\s*\/\s*\d+/, '').replace(/^[\s\-:,]+/, '').trim();
        }

        result.metrics.push({
          name,
          score,
          maxScore,
          note
        });
      }
    } else if (currentSection === 'STRENGTHS') {
      // Example: * Multi-Software Toolchain: Actively designs using AutoCAD (SLDs, cable layouts)...
      const strengthLine = line.replace(/^[\*\-\•\d+\.]\s*/, '').trim();
      if (!strengthLine) continue;

      const colonIdx = strengthLine.indexOf(':');
      if (colonIdx > 0) {
        const title = strengthLine.substring(0, colonIdx).trim();
        const description = strengthLine.substring(colonIdx + 1).trim();
        result.strengths.push({ title, description });
      } else {
        result.strengths.push({ title: 'Strength', description: strengthLine });
      }
    } else if (currentSection === 'WEAKNESSES') {
      // Example: * Temperature Coefficient Reversal (Fatal Physics Error): Claimed voltage increases... (Quote: "..."). Correction: ...
      const weaknessLine = line.replace(/^[\*\-\•\d+\.]\s*/, '').trim();
      if (!weaknessLine) continue;

      const colonIdx = weaknessLine.indexOf(':');
      let title = 'Critical Observation';
      let body = weaknessLine;

      if (colonIdx > 0 && colonIdx < 80) {
        title = weaknessLine.substring(0, colonIdx).trim();
        body = weaknessLine.substring(colonIdx + 1).trim();
      }

      // Extract Quote if available
      let quote = '';
      const quoteMatch = body.match(/\(Quote:\s*["“']?(.*?)["”']?\)/i) || body.match(/Quote:\s*["“']?(.*?)["”']?(?=\.\s*Correction|\.|$)/i);
      if (quoteMatch) {
        quote = quoteMatch[1].trim();
      }

      // Extract Correction if available
      let correction = '';
      const corrMatch = body.match(/Correction:\s*(.*?)$/i) || body.match(/Mentor Fix:\s*(.*?)$/i) || body.match(/Fix:\s*(.*?)$/i);
      if (corrMatch) {
        correction = corrMatch[1].trim();
      }

      // Extract mistake explanation by stripping quote & correction
      let mistake = body;
      if (quoteMatch) {
        mistake = mistake.replace(quoteMatch[0], '');
      }
      if (corrMatch) {
        mistake = mistake.replace(corrMatch[0], '');
      }
      mistake = mistake.replace(/\s+/g, ' ').trim();

      result.weaknesses.push({
        title,
        mistake,
        quote,
        correction
      });
    } else if (currentSection === 'ACTIONS') {
      // Example: * Retrain on Module I-V Physics: Practice calculating maximum string Voc...
      const actionLine = line.replace(/^[\*\-\•\d+\.]\s*/, '').trim();
      if (!actionLine) continue;

      const colonIdx = actionLine.indexOf(':');
      if (colonIdx > 0) {
        const title = actionLine.substring(0, colonIdx).trim();
        const action = actionLine.substring(colonIdx + 1).trim();
        result.actionItems.push({ title, action });
      } else {
        result.actionItems.push({ title: 'Action Item', action: actionLine });
      }
    }
  }

  // Fallback defaults if not found
  if (result.metrics.length === 0 && result.strengths.length === 0 && result.weaknesses.length === 0) {
    // Treat as unstructured text
    result.overallSummary = cleanText;
  }

  return result;
}

/**
 * Serializes a parsed audit analysis object back into standard structured report text
 */
export function serializeAuditAnalysis(parsed) {
  if (!parsed) return '';

  let text = `CANDIDATE PERFORMANCE METRICS & FEEDBACK\n\n`;

  if (parsed.candidateName) {
    text += `Candidate: ${parsed.candidateName}\n`;
  }
  if (parsed.targetRole) {
    text += `Target Role: ${parsed.targetRole}\n`;
  }
  if (parsed.overallScore !== null && parsed.overallScore !== undefined) {
    const summary = parsed.overallSummary ? ` (${parsed.overallSummary})` : '';
    text += `Overall Assessment: ${parsed.overallScore} / 10${summary}\n`;
  }

  text += `\nPERFORMANCE METRICS:\n`;
  if (parsed.metrics && parsed.metrics.length > 0) {
    parsed.metrics.forEach(m => {
      const note = m.note ? ` (${m.note})` : '';
      text += `* ${m.name}: ${m.score} / ${m.maxScore || 10}${note}\n`;
    });
  } else {
    text += `* Communication & Delivery: 8 / 10 (Clear articulation and pacing)\n`;
    text += `* Technical & Domain Knowledge: 7 / 10 (Good foundational grasp)\n`;
    text += `* Tools & Practical Workflow: 8 / 10 (Hands-on software workflow)\n`;
    text += `* Problem-Solving & Methodology: 7 / 10 (Structured problem decomposition)\n`;
    text += `* Standards & Quality Processes: 7 / 10 (Adheres to core guidelines)\n`;
  }

  if (parsed.strengths && parsed.strengths.length > 0) {
    text += `\nSTRENGTHS:\n`;
    parsed.strengths.forEach(s => {
      text += `* ${s.title}: ${s.description}\n`;
    });
  }

  if (parsed.weaknesses && parsed.weaknesses.length > 0) {
    text += `\nCRITICAL WEAKNESSES:\n`;
    parsed.weaknesses.forEach(w => {
      let line = `* ${w.title}: ${w.mistake || ''}`;
      if (w.quote) line += ` (Quote: "${w.quote}")`;
      if (w.correction) line += ` Correction: ${w.correction}`;
      text += `${line.trim()}\n`;
    });
  }

  if (parsed.actionItems && parsed.actionItems.length > 0) {
    text += `\nACTION ITEMS FOR MENTOR:\n`;
    parsed.actionItems.forEach(a => {
      text += `* ${a.title}: ${a.action}\n`;
    });
  }

  return text.trim();
}

