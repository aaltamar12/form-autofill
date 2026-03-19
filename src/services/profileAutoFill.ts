/**
 * Maps a saved user profile to form fields, reducing repeated prompts
 * for common data (name, address, company, etc.).
 */
export interface UserProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
}

export interface ProfileMapping {
  fieldName: string;
  value: string;
  source: "profile" | "ai";
  confidence: number;
}

const FIELD_MAP: Record<string, (p: UserProfile) => string | undefined> = {
  name: (p) => p.fullName,
  full_name: (p) => p.fullName,
  fullname: (p) => p.fullName,
  email: (p) => p.email,
  phone: (p) => p.phone,
  telephone: (p) => p.phone,
  company: (p) => p.company,
  organization: (p) => p.company,
  title: (p) => p.jobTitle,
  job_title: (p) => p.jobTitle,
  street: (p) => p.address?.street,
  address: (p) => p.address?.street,
  city: (p) => p.address?.city,
  state: (p) => p.address?.state,
  zip: (p) => p.address?.zip,
  postal_code: (p) => p.address?.zip,
  country: (p) => p.address?.country,
};

export function mapProfileToFields(
  profile: UserProfile,
  fields: FormField[]
): ProfileMapping[] {
  const results: ProfileMapping[] = [];

  for (const field of fields) {
    const key = field.name.toLowerCase().replace(/[\s-]/g, "_");
    const resolver = FIELD_MAP[key];
    if (!resolver) continue;

    const value = resolver(profile);
    if (value) {
      results.push({ fieldName: field.name, value, source: "profile", confidence: 1.0 });
    }
  }

  return results;
}
