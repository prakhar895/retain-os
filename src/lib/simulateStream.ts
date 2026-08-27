/**
 * Helper to simulate live AI reasoning telemetry and typewriter streaming
 * with zero external network requests.
 */

export interface StreamController {
  cancel: () => void;
}

export function streamText(
  fullText: string,
  onChunk: (currentText: string) => void,
  onComplete?: () => void,
  charsPerTick: number = 3,
  tickIntervalMs: number = 20
): StreamController {
  let currentIndex = 0;
  let timerId: number | null = null;
  let cancelled = false;

  function tick() {
    if (cancelled) return;
    
    currentIndex += charsPerTick;
    if (currentIndex >= fullText.length) {
      onChunk(fullText);
      if (onComplete) onComplete();
      return;
    }

    onChunk(fullText.slice(0, currentIndex));
    timerId = window.setTimeout(tick, tickIntervalMs);
  }

  timerId = window.setTimeout(tick, tickIntervalMs);

  return {
    cancel: () => {
      cancelled = true;
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
    }
  };
}

export const REASONING_STEPS = [
  'Analyzing usage telemetry & contract parameters…',
  'Correlating against 47 similar churned & saved enterprise accounts…',
  'Drafting tailored intervention plays & ROI asset templates…'
];
