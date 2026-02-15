import { autofillFromText } from "./formAutoFiller";
import type { FormField } from "./formAutoFiller";

// Re-export type for external use
export type { FormField };

export async function fillFormFromVoice(audioBlob: Blob, fields: FormField[]): Promise<Record<string, string | number | null>> {
  // Step 1: Transcribe with Whisper
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  const transcribeRes = await fetch("/api/transcribe", { method: "POST", body: formData });
  const { text } = await transcribeRes.json();

  // Step 2: Autofill from transcript
  const result = await autofillFromText(text, fields);
  return result.fields;
}
