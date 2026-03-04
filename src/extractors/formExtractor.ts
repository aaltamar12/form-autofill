export interface FormField { name: string; type: string; label: string; required: boolean; options?: string[] }
export function extractFormFields(form: HTMLFormElement): FormField[] {
  return Array.from(form.elements).flatMap(el => {
    const input = el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    if (!input.name) return [];
    const label = form.querySelector(`label[for="${input.id}"]`)?.textContent?.trim()
      ?? input.getAttribute("aria-label")
      ?? input.getAttribute("placeholder")
      ?? input.name;
    const base = { name: input.name, type: input.tagName.toLowerCase() === "select" ? "select" : (input as HTMLInputElement).type || "text", label, required: input.required };
    if (input.tagName === "SELECT") {
      const options = Array.from((input as HTMLSelectElement).options).map(o => o.text);
      return [{ ...base, options }];
    }
    return [base];
  });
}
