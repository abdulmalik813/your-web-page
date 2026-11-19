import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactPayload,
  validateStartProjectPayload,
} from './validation';

test('validateContactPayload rejects missing fields and invalid email', () => {
  const res = validateContactPayload({
    name: '',
    email: 'not-an-email',
    type: '',
    message: ' ',
  });
  assert.equal(res.valid, false);
  assert.equal(res.honeypotTriggered, false);
  assert.ok(res.errors.name);
  assert.ok(res.errors.email);
  assert.ok(res.errors.type);
  assert.ok(res.errors.message);
});

test('validateContactPayload accepts valid submission and trims values', () => {
  const res = validateContactPayload({
    name: '  Alex MacLeod  ',
    email: ' alex@example.ca ',
    phone: ' (902) 555-0100 ',
    type: 'Website',
    message: 'Looking for a new website.',
  });
  assert.equal(res.valid, true);
  assert.equal(res.honeypotTriggered, false);
  assert.deepEqual(res.errors, {});
  assert.equal(res.sanitized.name, 'Alex MacLeod');
  assert.equal(res.sanitized.email, 'alex@example.ca');
});

test('honeypot detection flags spam submissions silently', () => {
  const contactSpam = validateContactPayload({
    company_website: 'https://spam.example.com',
  });
  assert.equal(contactSpam.honeypotTriggered, true);

  const startSpam = validateStartProjectPayload({
    company_website: 'bot-entry',
  });
  assert.equal(startSpam.honeypotTriggered, true);
});

test('validateStartProjectPayload checks required fields and optional URL format', () => {
  const badUrl = validateStartProjectPayload({
    biz: 'Island Crafts',
    yname: 'Sam',
    email: 'sam@example.ca',
    site: 'not a url',
    goals: 'Sell online',
  });
  assert.equal(badUrl.valid, false);
  assert.ok(badUrl.errors.site);

  const good = validateStartProjectPayload({
    biz: 'Island Crafts',
    yname: 'Sam',
    email: 'sam@example.ca',
    site: 'https://example.ca',
    goals: 'Sell online across Canada',
    pages: ['Home', 'Online store'],
    features: ['Online payments'],
  });
  assert.equal(good.valid, true);
  assert.deepEqual(good.errors, {});
});
