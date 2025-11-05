import { clamp } from 'lodash';

const keyHints = [
  { pattern: /c(m|maj)?/i, value: 'C' },
  { pattern: /am/i, value: 'Am' },
  { pattern: /g(m|maj)?/i, value: 'G' },
  { pattern: /em/i, value: 'Em' },
  { pattern: /dm/i, value: 'Dm' },
  { pattern: /f(m|maj)?/i, value: 'F' }
];

const bpmHints = [
  { pattern: /slow/i, value: 72 },
  { pattern: /fast/i, value: 140 },
  { pattern: /mid|medium/i, value: 110 },
  { pattern: /(\d{2,3})bpm/i, value: (match) => Number(match[1]) }
];

export function detectKey(filename) {
  if (!filename) return 'C';
  const hint = keyHints.find(({ pattern }) => pattern.test(filename));
  return hint?.value ?? 'C';
}

export function detectBpm(filename) {
  if (!filename) return 110;
  const hint = bpmHints.find(({ pattern }) => pattern.test(filename));
  if (!hint) return 110;
  const result = typeof hint.value === 'function' ? hint.value(filename.match(hint.pattern)) : hint.value;
  return clamp(result, 60, 200);
}

export function inferDuration(file) {
  if (!file) return 120;
  return clamp(Math.round((file.size / (1024 * 1024)) * 60 + 60), 60, 240);
}
