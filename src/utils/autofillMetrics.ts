export interface AutofillSession {
  sessionId: string;
  fieldCount: number;
  filledCount: number;
  skippedCount: number;      // below MIN_CONFIDENCE threshold
  profileFilledCount: number;
  aiFilledCount: number;
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  timestamp: string;
}

const sessions: AutofillSession[] = [];

export function recordSession(
  session: Omit<AutofillSession, "sessionId" | "timestamp">
): string {
  const sessionId = Math.random().toString(36).slice(2, 10);
  sessions.push({ ...session, sessionId, timestamp: new Date().toISOString() });

  const fillRate =
    session.fieldCount > 0
      ? ((session.filledCount / session.fieldCount) * 100).toFixed(1)
      : "0";
  console.info(
    `[autofill] session=${sessionId} fields=${session.fieldCount} ` +
      `filled=${session.filledCount}(${fillRate}%) profile=${session.profileFilledCount} ` +
      `ai=${session.aiFilledCount} tokens=${session.promptTokens + session.completionTokens} ` +
      `latency=${session.latencyMs}ms`
  );
  return sessionId;
}

export function getAverageFillRate(): number {
  if (sessions.length === 0) return 0;
  const sum = sessions.reduce(
    (s, sess) => s + (sess.fieldCount > 0 ? sess.filledCount / sess.fieldCount : 0),
    0
  );
  return Math.round((sum / sessions.length) * 1000) / 10; // percentage with 1 decimal
}

export function getProfileVsAiRatio(): { profilePct: number; aiPct: number } {
  const totalFilled = sessions.reduce((s, sess) => s + sess.filledCount, 0);
  if (totalFilled === 0) return { profilePct: 0, aiPct: 0 };
  const profileTotal = sessions.reduce((s, sess) => s + sess.profileFilledCount, 0);
  const aiTotal = sessions.reduce((s, sess) => s + sess.aiFilledCount, 0);
  return {
    profilePct: Math.round((profileTotal / totalFilled) * 100),
    aiPct: Math.round((aiTotal / totalFilled) * 100),
  };
}
