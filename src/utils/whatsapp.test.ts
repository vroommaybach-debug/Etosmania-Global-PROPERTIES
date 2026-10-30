import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WHATSAPP_PHONE_NUMBER,
  getWhatsAppUrl,
  getPropertyWhatsAppMessage,
  getDevelopmentWhatsAppMessage,
  getInspectionWhatsAppMessage,
  getCoOwnershipWhatsAppMessage,
} from './whatsapp.ts';

test('WHATSAPP_PHONE_NUMBER is properly formatted with country code and digits only', () => {
  assert.equal(WHATSAPP_PHONE_NUMBER, '2349138453949');
  assert.match(WHATSAPP_PHONE_NUMBER, /^[0-9]+$/);
});

test('getWhatsAppUrl encodes message and preserves phone number', () => {
  const url = getWhatsAppUrl('Hello Etosmania Global Properties!', '2349138453949');
  assert.equal(url, 'https://wa.me/2349138453949?text=Hello%20Etosmania%20Global%20Properties!');
});

test('getWhatsAppUrl sanitizes phone with plus signs or dashes', () => {
  const url = getWhatsAppUrl('Hi', '+234-913-845-3949');
  assert.equal(url, 'https://wa.me/2349138453949?text=Hi');
});

test('getPropertyWhatsAppMessage generates exact required format', () => {
  const msg = getPropertyWhatsAppMessage({
    title: '5 Bed Duplex',
    location: 'Ajah',
    id: 'EGP-101',
  });
  assert.equal(
    msg,
    "Hello Etosmania Global Properties, I'm interested in 5 Bed Duplex at Ajah (Ref: EGP-101). Is it still available?"
  );
});

test('getDevelopmentWhatsAppMessage formats off-plan project query', () => {
  const msg = getDevelopmentWhatsAppMessage({
    name: 'Etosmania Gold Crest Estate',
    location: 'Ajah',
    id: 'DEV-01',
  });
  assert.equal(
    msg,
    'Hello Etosmania Global Properties, I would like to enquire about availability and payment milestones for Etosmania Gold Crest Estate in Ajah (Ref: DEV-01).'
  );
});

test('getInspectionWhatsAppMessage formats booking with date and name', () => {
  const msg = getInspectionWhatsAppMessage({
    propertyTitle: 'Penthouse Suite',
    location: 'Victoria Island',
    ref: 'EGP-202',
    preferredDate: '2026-11-05',
    preferredTime: '11:00 AM',
    clientName: 'Emeka Adeleke',
  });
  assert.match(msg, /Penthouse Suite/);
  assert.match(msg, /EGP-202/);
  assert.match(msg, /2026-11-05/);
  assert.match(msg, /Emeka Adeleke/);
});

test('getCoOwnershipWhatsAppMessage formats co-ownership slot reservation', () => {
  const msg = getCoOwnershipWhatsAppMessage({
    projectTitle: 'Thomas Estate Co-Ownership Duplex',
    slots: 2,
    totalInvestment: '₦30,000,000',
  });
  assert.match(msg, /2 co-ownership slots/);
  assert.match(msg, /Thomas Estate Co-Ownership Duplex/);
});
