import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.formData();

  console.log(data.get("file"));

  return NextResponse.json("Imagen subida");
}
