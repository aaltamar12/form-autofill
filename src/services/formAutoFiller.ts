import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "date" | "number" | "select" | "textarea";
  options?: string[];
  required?: boolean;
}

interface AutofillResult {
  fields: Record<string, string | number | null>;
  confidence: Record<string, number>;
  missingRequired: string[];
}

export async function autofillFromText(naturalLanguageInput: string, formFields: FormField[]): Promise<AutofillResult> {
  const fieldDescriptions = formFields
    .map((f) => `- ${f.name} (${f.type}${f.required ? ", required" : ""}${f.options ? `, options: ${f.options.join("|")}` : ""}): ${f.label}`)
    .join("\n");

  const ResponseSchema = z.object({
    fields: z.record(z.union([z.string(), z.number(), z.null()])),
    confidence: z.record(z.number()),
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Extract form field values from natural language input. Return JSON with fields (field_name -> value or null) and confidence (field_name -> 0-1). Only extract what's mentioned; null for missing fields.
Form fields:\n${fieldDescriptions}`,
      },
      { role: "user", content: naturalLanguageInput },
    ],
    response_format: { type: "json_object" },
    temperature: 0,
    max_tokens: 400,
  });

  const parsed = ResponseSchema.parse(JSON.parse(response.choices[0].message.content ?? "{}"));
  const missingRequired = formFields
    .filter((f) => f.required && (parsed.fields[f.name] === null || parsed.fields[f.name] === undefined))
    .map((f) => f.name);

  return { ...parsed, missingRequired };
}

export async function autofillFromDocument(documentText: string, formFields: FormField[]): Promise<AutofillResult> {
  return autofillFromText(`Extract the following data from this document:\n\n${documentText}`, formFields);
}
