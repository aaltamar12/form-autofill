import OpenAI from "openai";
import { type FormField } from "../extractors/formExtractor";
const client = new OpenAI();
type FieldValues = Record<string, string>;
export async function autofillForm(fields: FormField[], context: string): Promise<FieldValues> {
  const { choices } = await client.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Fill in the form fields using the provided context. Return JSON: {fieldName: value}. Only include fields you can confidently fill." },
      { role: "user", content: `Context:\n${context}\n\nForm fields:\n${JSON.stringify(fields, null, 2)}` },
    ],
    temperature: 0.1,
  });
  return JSON.parse(choices[0].message.content!) as FieldValues;
}
