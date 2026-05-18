import { NextRequest, NextResponse } from "next/server";

async function forwardRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
  method: string,
) {
  const searchParams = request.nextUrl.searchParams.toString();
  const resolvedParams = await params;
  const path = resolvedParams.path.join("/");
  const token = request.headers.get("authorization");

  let body = null;
  if (method !== "GET") {
    body = await request.json().catch(() => null);
  }
  const res = await fetch(
    `https://test-180dc.vercel.app/api/v1/${path}/?${searchParams}`,
    {
      method: method,
      headers: {
        Authorization: token || "",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : null,
      cache: "no-store",
    },
  );

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function GET(request: NextRequest, context: any) {
  return forwardRequest(request, context, "GET");
}

export async function POST(request: NextRequest, context: any) {
  return forwardRequest(request, context, "POST");
}
