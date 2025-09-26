// src/app/api/scheme/[code]/sip/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { SchemeDetails } from '@/lib/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  try {
    const { amount, period, rate } = await request.json();

    if (!amount || !period || !rate) {
      return NextResponse.json({ error: 'Missing required fields: amount, period, rate' }, { status: 400 });
    }



    // Calculate SIP returns
    const monthlyRate = rate / 12 / 100;
    const months = period * 12;
    
    const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const totalInvestment = amount * months;
    const estimatedReturns = futureValue - totalInvestment;
    
    const result = {
      totalInvestment: Math.round(totalInvestment),
      estimatedReturns: Math.round(estimatedReturns),
      futureValue: Math.round(futureValue)
    };
    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}