export function normalizeTrafficSource(value) {
  const source = value?.trim().toLowerCase();

  if (!source) {
    return null;
  }

  if (source.includes('facebook') || source === 'fb') {
    return 'facebook';
  }

  if (source.includes('youtube') || source.includes('youtu')) {
    return 'youtube';
  }

  if (source.includes('instagram') || source === 'ig') {
    return 'instagram';
  }

  if (
    source.includes('twitter') ||
    source === 'x' ||
    source.includes('x.com') ||
    source.includes('t.co')
  ) {
    return 'twitter';
  }

  return null;
}

export function getTrafficSource() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = normalizeTrafficSource(params.get('utm_source'));

  if (utmSource) {
    return utmSource;
  }

  const referrer = normalizeTrafficSource(document.referrer);
  return referrer || 'direct_or_other';
}

export function getTrafficProperties(pathname = window.location.pathname) {
  return {
    landing_source: getTrafficSource(),
    utm_source: new URLSearchParams(window.location.search).get('utm_source'),
    landing_path: pathname,
  };
}
