/**
 * Normalizes any pasted image URL (Google Drive, Pinterest, Dropbox, Imgur,
 * Unsplash, protocol-relative URLs, or Data URLs) into a fast-loading direct image URL
 * that renders reliably on mobile phones and desktop browsers.
 */
export function normalizeExternalImageUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Keep Data URLs and Blob URLs intact
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  // Handle protocol-relative URLs
  let url = trimmed.startsWith('//') ? `https:${trimmed}` : trimmed;
  if (!/^https?:\/\//i.test(url) && !url.startsWith('/')) {
    url = `https://${url}`;
  }

  // 1. Google Drive links:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID&export=download
  // - https://drive.google.com/thumbnail?id=FILE_ID
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}=w1600`;
  }
  const driveIdMatch = url.match(/drive\.google\.com\/(?:open|uc|thumbnail)\?[^#]*id=([a-zA-Z0-9_-]+)/i);
  if (driveIdMatch?.[1]) {
    return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}=w1600`;
  }

  // 2. Dropbox share links: convert ?dl=0 or www.dropbox.com to direct raw stream
  if (/dropbox\.com/i.test(url)) {
    return url
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace(/[?&]dl=0\b/, '')
      .replace(/[?&]dl=1\b/, '');
  }

  // 3. Pinterest image CDN (i.pinimg.com): upgrade low-res 236x / 474x thumbnails to 736x / originals for crisp mobile & desktop display
  if (/i\.pinimg\.com\/(?:236x|474x)\//i.test(url)) {
    return url.replace(/i\.pinimg\.com\/(?:236x|474x)\//i, 'i.pinimg.com/736x/');
  }

  // 4. Imgur single-image page link: https://imgur.com/abcDEF -> https://i.imgur.com/abcDEF.jpg
  const imgurMatch = url.match(/^https?:\/\/(?:www\.)?imgur\.com\/([a-zA-Z0-9]{5,10})$/i);
  if (imgurMatch?.[1]) {
    return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
  }

  return url;
}

/**
 * Generates an optimized global CDN proxy URL (wsrv.nl) as an automatic fallback
 * when an external image link (e.g. Pinterest pin, Google Drive, or hotlink-protected server)
 * fails direct loading on mobile or desktop browsers.
 */
export function buildProxyFallbackImageUrl(rawUrl: string, maxWidth = 1400): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();
  if (
    !trimmed ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('/') ||
    trimmed.includes('wsrv.nl')
  ) {
    return '';
  }

  // If a Google Drive lh3 URL failed, try drive thumbnail endpoint first
  const lh3Match = trimmed.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/i);
  if (lh3Match?.[1]) {
    return `https://drive.google.com/thumbnail?id=${lh3Match[1]}&sz=w1600`;
  }

  return `https://wsrv.nl/?url=${encodeURIComponent(trimmed)}&w=${maxWidth}&q=80&output=webp`;
}

/**
 * Detects the source type of an image URL for helpful Admin UI feedback.
 */
export function detectImageSourceType(url: string): string {
  if (!url) return 'Empty';
  if (url.startsWith('data:image/')) return 'Device Upload (Optimized)';
  if (/drive\.google\.com|googleusercontent\.com\/d\//i.test(url)) return 'Google Drive Image';
  if (/pinimg\.com|pinterest\.|pin\.it/i.test(url)) return 'Pinterest Image';
  if (/dropbox/i.test(url)) return 'Dropbox Image';
  if (/unsplash\.com/i.test(url)) return 'Unsplash Architectural Photo';
  return 'External Web Image Link';
}

/**
 * Compresses and converts an uploaded image File from phone or desktop into a compact
 * JPEG Data URL suitable for storing in Firestore documents and localStorage (< 350KB).
 */
export function processUploadedImageFile(
  file: File,
  maxWidth = 1400,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const isImageMime =
      !file.type ||
      file.type.startsWith('image/') ||
      /\.(jpe?g|png|webp|gif|avif|heic|heif|svg|bmp)$/i.test(file.name);

    if (!isImageMime) {
      reject(new Error('Please select a valid image file (JPG, PNG, WEBP, HEIC, AVIF, SVG).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('Empty image data.'));
        return;
      }

      const img = new Image();
      img.onerror = () => {
        // Fallback to raw dataUrl if Image decode fails (e.g. HEIC on some browsers)
        resolve(dataUrl);
      };
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch {
          resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}
