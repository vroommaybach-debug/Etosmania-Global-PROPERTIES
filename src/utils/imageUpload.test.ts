import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeExternalImageUrl,
  buildProxyFallbackImageUrl,
  detectImageSourceType,
} from './imageUpload';

test('normalizeExternalImageUrl converts Google Drive share URLs into direct fast-loading image URLs', () => {
  const shareUrl =
    'https://drive.google.com/file/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456/view?usp=sharing';
  assert.equal(
    normalizeExternalImageUrl(shareUrl),
    'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456=w1600'
  );

  const openUrl = 'https://drive.google.com/open?id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456';
  assert.equal(
    normalizeExternalImageUrl(openUrl),
    'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456=w1600'
  );
});

test('normalizeExternalImageUrl upgrades Pinterest thumbnail URLs and normalizes Dropbox links', () => {
  const pinThumb = 'https://i.pinimg.com/236x/ab/cd/ef/abcdef12345.jpg';
  assert.equal(
    normalizeExternalImageUrl(pinThumb),
    'https://i.pinimg.com/736x/ab/cd/ef/abcdef12345.jpg'
  );

  const dropboxUrl = 'https://www.dropbox.com/s/xyz123/villa.jpg?dl=0';
  assert.equal(
    normalizeExternalImageUrl(dropboxUrl),
    'https://dl.dropboxusercontent.com/s/xyz123/villa.jpg'
  );
});

test('buildProxyFallbackImageUrl provides a secondary fallback for Google Drive and external URLs', () => {
  const driveDirect = 'https://lh3.googleusercontent.com/d/1AbCdEfGhIjKlMnOpQrStUvWxYz123456=w1600';
  assert.equal(
    buildProxyFallbackImageUrl(driveDirect),
    'https://drive.google.com/thumbnail?id=1AbCdEfGhIjKlMnOpQrStUvWxYz123456&sz=w1600'
  );

  const pinUrl = 'https://i.pinimg.com/736x/ab/cd/ef/abcdef12345.jpg';
  assert.equal(
    buildProxyFallbackImageUrl(pinUrl).startsWith('https://wsrv.nl/?url='),
    true
  );
});

test('detectImageSourceType identifies Google Drive, Pinterest, and Device uploads', () => {
  assert.equal(detectImageSourceType('data:image/jpeg;base64,/9j/4AAQ'), 'Device Upload (Optimized)');
  assert.equal(
    detectImageSourceType('https://drive.google.com/file/d/12345/view'),
    'Google Drive Image'
  );
  assert.equal(
    detectImageSourceType('https://i.pinimg.com/736x/ab/cd/ef.jpg'),
    'Pinterest Image'
  );
});
