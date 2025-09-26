// src/app/api/mf/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch with caching (revalidates every 24 hours)
    const response = await fetch('https://api.mfapi.in/mf', {
      next: { revalidate: 86400 }, 
    });

    if (!response.ok) {
      throw new Error('Failed to fetch mutual fund schemes');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}