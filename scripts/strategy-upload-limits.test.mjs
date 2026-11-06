import assert from 'node:assert/strict';
import test from 'node:test';
import { auditImageDataSize, MAX_AUDIT_IMAGE_BYTES, MAX_AUDIT_TOTAL_BYTES } from '../src/app/strategy/audit/upload-limits.ts';

test('image size validation accounts for base64 padding and 25 MB boundary', () => {
  for (const size of [1, 2, 3, MAX_AUDIT_IMAGE_BYTES, MAX_AUDIT_IMAGE_BYTES + 1]) {
    const dataUrl = `data:image/png;base64,${Buffer.alloc(size).toString('base64')}`;
    assert.equal(auditImageDataSize(dataUrl), size);
  }
  assert.equal(auditImageDataSize('data:image/png;base64,AA'), null);
  assert.equal(auditImageDataSize('data:text/plain;base64,YQ=='), null);
  assert.equal(MAX_AUDIT_TOTAL_BYTES, 2 * MAX_AUDIT_IMAGE_BYTES);
});
