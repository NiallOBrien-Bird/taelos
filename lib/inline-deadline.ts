import { parseHumanDeadline, type HumanDeadline } from './human-deadline';

/**
 * Splits a typed line such as "call the bank fri 3pm" into a title and a
 * deadline, using the same rule-based parser as the rest of Taelos. Nothing
 * leaves the device and there is no model involved: it simply tries the last
 * few words of the line, longest first, and keeps the longest phrase that the
 * parser recognises.
 */

const MAX_PHRASE_WORDS = 6;
const trailingConnector = /\s+(?:by|due|on|at|for|@)$/i;

export type InlineDeadline = {
  title: string;
  deadline?: HumanDeadline;
  /** The exact trailing text that was read as the deadline. */
  phrase?: string;
};

export function splitInlineDeadline(
  line: string,
  now = new Date(),
  dayEndTime?: string,
): InlineDeadline {
  const text = line.replace(/\s+/g, ' ').trim();
  if (!text) return { title: '' };
  const words = text.split(' ');

  // Keep at least one word for the title.
  const longest = Math.min(MAX_PHRASE_WORDS, words.length - 1);
  for (let count = longest; count >= 1; count -= 1) {
    const phrase = words.slice(-count).join(' ').replace(/^@/, '');
    // "sit in the sun" is not a Sunday task.
    const before = words[words.length - count - 1] ?? '';
    if (/^the\b/i.test(phrase) || /^(?:the|a|an|my|your)$/i.test(before)) continue;
    const deadline = parseHumanDeadline(phrase, now, dayEndTime);
    if (!deadline) continue;
    const title = words
      .slice(0, -count)
      .join(' ')
      .replace(trailingConnector, '')
      .trim();
    if (!title) continue;
    return { title, deadline, phrase };
  }
  return { title: text };
}
