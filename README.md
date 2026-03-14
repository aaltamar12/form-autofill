# form-autofill

AI capability: **Natural language to structured form fields** using GPT-4o structured output.
Extracts DOM form fields, maps user context (typed text or voice input) to field values with confidence scores, and supports expense forms out of the box.

## Models used
- `gpt-4o` — natural language to field mapping with structured output
- `whisper-1` — voice-to-text for voice-driven autofill

## How to run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), load a demo form, and click "Autofill with AI".

## Environment variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | OpenAI API key |
| `AUTOFILL_MODEL` | default: `gpt-4o` |
| `WHISPER_MODEL` | default: `whisper-1` |
| `MIN_CONFIDENCE` | Minimum confidence to apply (default: `0.7`) |
