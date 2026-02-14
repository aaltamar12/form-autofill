import { NextRequest, NextResponse } from "next/server";
import { autofillFromText } from "@/services/formAutoFiller";

export async function POST(req: NextRequest) {
  const { input, fields } = await req.json();
  if (!input || !fields) return NextResponse.json({ error: "Missing input or fields" }, { status: 400 });
  const result = await autofillFromText(input, fields);
  return NextResponse.json(result);
}
