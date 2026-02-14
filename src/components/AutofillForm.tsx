"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";

const EXPENSE_FIELDS = [
  { name: "vendor", label: "Vendor/Merchant", type: "text" as const, required: true },
  { name: "amount", label: "Amount", type: "number" as const, required: true },
  { name: "currency", label: "Currency", type: "select" as const, options: ["USD", "EUR", "GBP"], required: true },
  { name: "date", label: "Date", type: "date" as const, required: true },
  { name: "category", label: "Category", type: "select" as const, options: ["Travel", "Meals", "Software", "Office", "Other"] },
  { name: "notes", label: "Notes", type: "textarea" as const },
];

export default function AutofillForm() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, setValue, formState: { errors }, handleSubmit } = useForm();

  async function handleAutofill() {
    setLoading(true);
    const res = await fetch("/api/autofill", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, fields: EXPENSE_FIELDS }),
    });
    const { fields } = await res.json();
    Object.entries(fields).forEach(([k, v]) => v !== null && setValue(k, v));
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Expense Form</h1>
      <div className="space-y-2">
        <label className="text-sm font-medium">Describe your expense</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I had lunch with the team at Olive Garden for $85 USD on June 15th"
          className="w-full border rounded-lg p-3 text-sm h-24"
        />
        <button onClick={handleAutofill} disabled={loading || !input} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50 text-sm">
          {loading ? "Filling…" : "✨ Auto-fill"}
        </button>
      </div>
      <form onSubmit={handleSubmit(console.log)} className="space-y-4">
        {EXPENSE_FIELDS.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">{field.label}{field.required && " *"}</label>
            {field.type === "select" ? (
              <select {...register(field.name)} className="w-full border rounded px-3 py-2 text-sm">
                <option value="">Select…</option>
                {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : field.type === "textarea" ? (
              <textarea {...register(field.name)} className="w-full border rounded px-3 py-2 text-sm h-20" />
            ) : (
              <input type={field.type} {...register(field.name)} className="w-full border rounded px-3 py-2 text-sm" />
            )}
          </div>
        ))}
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Submit Expense</button>
      </form>
    </div>
  );
}
