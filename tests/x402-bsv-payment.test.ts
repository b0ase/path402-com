import { describe, expect, it, vi } from 'vitest';
import { verifyBSVPayment } from '@/lib/x402';
import { verifyBsvPaymentTx, type BsvTx } from '@/lib/bsv-verify';

const TX = 'ab'.repeat(32);
const payload = (o: Record<string, string> = {}) => ({
  signature: 's',
  authorization: { from: '1FROM', to: '1PAY', value: '500', nonce: 'n', ...o },
  txId: TX,
});
const ok = (paidSats: number, status: 'mempool' | 'mined' = 'mempool') =>
  vi.fn(async () => ({ valid: true, paidSats, seen: true, status }));

describe('verifyBSVPayment', () => {
  it('reports the verified paid amount, payTo and broadcast status', async () => {
    const v = await verifyBSVPayment(payload(), { payTo: '1PAY', maxAmountRequired: '500' }, ok(750, 'mined'));
    expect(v).toMatchObject({ valid: true, txId: TX, amount: 750, payTo: '1PAY', broadcast: true, status: 'mined' });
  });

  it('checks against the resource server requirement, not the payer claim', async () => {
    const verifyTx = ok(500);
    await verifyBSVPayment(payload({ value: '1' }), { payTo: '1PAY', maxAmountRequired: '500' }, verifyTx);
    expect(verifyTx).toHaveBeenCalledWith({ txId: TX, expectedAddress: '1PAY', minSats: 500 });
  });

  it('rejects an authorization addressed to someone other than payTo', async () => {
    const v = await verifyBSVPayment(payload({ to: '1EVIL' }), { payTo: '1PAY', maxAmountRequired: '500' }, ok(500));
    expect(v.valid).toBe(false);
  });

  it('rejects a malformed txid and a zero amount', async () => {
    expect((await verifyBSVPayment({ ...payload(), txId: 'nope' }, undefined, ok(500))).valid).toBe(false);
    expect((await verifyBSVPayment(payload({ value: '0' }), undefined, ok(500))).valid).toBe(false);
  });

  it('marks a tx the network has not seen as not broadcast', async () => {
    const v = await verifyBSVPayment(payload(), undefined, vi.fn(async () => ({ valid: false, paidSats: 0, seen: false })));
    expect(v).toMatchObject({ valid: false, broadcast: false, invalidReason: 'Payment not found on-chain' });
  });
});

describe('verifyBsvPaymentTx status', () => {
  const tx = (o: Partial<BsvTx>): BsvTx => ({ txid: TX, vout: [{ value: 0.000005, scriptPubKey: { addresses: ['1PAY'] } }], ...o });
  it('mempool vs mined', async () => {
    expect((await verifyBsvPaymentTx({ txId: TX, expectedAddress: '1PAY', minSats: 500 }, async () => tx({}))).status).toBe('mempool');
    expect((await verifyBsvPaymentTx({ txId: TX, expectedAddress: '1PAY', minSats: 500 }, async () => tx({ confirmations: 2 }))).status).toBe('mined');
  });
  it('a tx paying zero to us is invalid', async () => {
    const r = await verifyBsvPaymentTx({ txId: TX, expectedAddress: '1OTHER', minSats: 500 }, async () => tx({}));
    expect(r).toMatchObject({ valid: false, paidSats: 0, seen: true });
  });
  it('rejects a reply for a different txid', async () => {
    const r = await verifyBsvPaymentTx({ txId: TX, expectedAddress: '1PAY', minSats: 500 }, async () => tx({ txid: 'cd'.repeat(32) }));
    expect(r.valid).toBe(false);
  });
});
