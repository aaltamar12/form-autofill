import OpenAI from "openai";

export class AutofillError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "AutofillError";
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3
): Promise<T> {
  let delay = 800;
  let lastErr: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;

      if (err instanceof OpenAI.RateLimitError) {
        console.warn(`[autofill] rate limited — retry ${attempt}/${maxAttempts} in ${delay}ms`);
        await new Promise((r) => setTimeout(r, delay));
        delay *= 2;
        continue;
      }

      if (err instanceof SyntaxError) {
        // Malformed JSON from structured output — retry once
        if (attempt < maxAttempts) {
          console.warn(`[autofill] JSON parse error on attempt ${attempt}, retrying`);
          continue;
        }
        throw new AutofillError("GPT-4o returned malformed structured output after retries", err);
      }

      throw err;
    }
  }

  throw lastErr;
}
