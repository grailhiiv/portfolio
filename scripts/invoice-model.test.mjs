import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calculate, validatePayments } from '../src/app/invoice/model.ts';

const draft = (overrides = {}) => ({
  id: 'test', number: 'INV-1', client: 'Test Client', email: '', address: '', issued: '', due: '', period: '', next: '',
  lines: [{ id: 'line', category: 'General', name: 'Service', price: 100, quantity: 1, unit: 'project', frequency: 'one-time', scope: '', clientDirect: false }],
  discount: 0, tax: 0, paid: 0, request: '', paymentDate: '', instructions: '', notes: '', ...overrides,
});

test('valid payment boundaries retain the requested amount', () => {
  const invoice = draft({ discount: 10, paid: 20, request: '70' });
  assert.deepEqual(validatePayments(invoice), { discount: '', paid: '', request: '' });
  assert.equal(calculate(invoice).requested, 70);
});
test('rejects discount, payment, and requested amounts above their limits', () => {
  assert.match(validatePayments(draft({ discount: 101 })).discount, /subtotal/);
  assert.match(validatePayments(draft({ paid: 101 })).paid, /invoice total/);
  assert.match(validatePayments(draft({ paid: 20, request: '81' })).request, /remaining balance/);
  assert.match(validatePayments(draft({ request: '-1' })).request, /zero or more/);
});
test('direct expenses and unpriced lines are excluded from totals', () => {
  const invoice = draft({ lines: [
    { id: 'a', category: 'General', name: 'Direct', price: 100, quantity: 1, unit: 'item', frequency: 'one-time', scope: '', clientDirect: true },
    { id: 'b', category: 'General', name: 'Unpriced', price: null, quantity: 1, unit: 'project', frequency: 'one-time', scope: '', clientDirect: false },
  ] });
  assert.equal(calculate(invoice).total, 0);
  assert.equal(calculate(invoice).unresolved, true);
  assert.match(validatePayments(draft({ ...invoice, discount: 1 })).discount, /subtotal/);
});
