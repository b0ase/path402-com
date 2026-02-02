import { NextRequest, NextResponse } from 'next/server';
import { confirmPurchase } from '@/lib/store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purchaseId, txId } = body;

    if (!purchaseId || !txId) {
      return NextResponse.json({ error: 'Missing purchaseId or txId' }, { status: 400 });
    }

    const success = await confirmPurchase(purchaseId, txId);

    if (!success) {
      return NextResponse.json({ error: 'Purchase not found or already confirmed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, status: 'confirmed' });
  } catch (error) {
    console.error('Error confirming purchase:', error);
    return NextResponse.json({ error: 'Confirmation failed' }, { status: 500 });
  }
}
