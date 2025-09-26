// src/app/api/scheme/[code]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = params;
  if (!code) {
    return NextResponse.json({ error: 'Scheme code is required' }, { status: 400 });
  }

  try {
    // Fetch with caching (revalidates every 12 hours)
    const response = await fetch(`https://api.mfapi.in/mf/${code}`, {
      next: { revalidate: 43200 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scheme details for code: ${code}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}