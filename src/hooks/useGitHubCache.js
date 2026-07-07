const TTL_MS = 5 * 60 * 1000; // 5 minutes

function safeRead(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') return null;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function safeWrite(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* quota or storage unavailable — fail silently */
  }
}

/**
 * Caches GitHub API responses in sessionStorage so the user
 * can navigate around without burning through the 60 req/h rate limit.
 */
export function getCached(key) {
  return safeRead(key);
}

export function setCached(key, data) {
  safeWrite(key, data);
}
