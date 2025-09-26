// src/app/api/scheme/[code]/returns/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { subMonths, subYears, formatISO } from 'date-fns';
import { calculateReturns } from '@/lib/calculations';
import { SchemeDetails } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period');
  let from = searchParams.get('from');
  let to = searchParams.get('to');

  try {
    // Fetch NAV data without internal API call for performance
    const res = await fetch(`https://api.mfapi.in/mf/${code}`, { next: { revalidate: 43200 }});
    if (!res.ok) throw new Error('Failed to fetch scheme NAV data.');
    const schemeData: SchemeDetails = await res.json();
    
    if (!schemeData.data || schemeData.data.length === 0) {
        return NextResponse.json({ error: 'No NAV data available for this scheme.' }, { status: 404 });
    }

    const today = new Date();
    to = to ? to : formatISO(today, { representation: 'date' });

    if (period) {
      switch (period) {
        case '1m': from = formatISO(subMonths(today, 1), { representation: 'date' }); break;
        case '3m': from = formatISO(subMonths(today, 3), { representation: 'date' }); break;
        case '6m': from = formatISO(subMonths(today, 6), { representation: 'date' }); break;
        case '1y': from = formatISO(subYears(today, 1), { representation: 'date' }); break;
        default: return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
      }
    } else if (!from) {
      return NextResponse.json({ error: 'Either period or from/to is required' }, { status: 400 });
    }
    
    const result = calculateReturns(schemeData.data, from, to);
    return NextResponse.json(result);

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}