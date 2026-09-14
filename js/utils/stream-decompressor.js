/**
 * FeUniversal - Universal Stream Decompressor
 * Handles on-the-fly streaming decompression of Gzip (.gz) JSON corpora
 * using native hardware-accelerated DecompressionStream with automatic fallback.
 */

export async function fetchAndDecompressJson(baseUrl, options = {}) {
  const { preferCompressed = true, timeout = 15000 } = options;

  // 1. Determine Node.js vs Browser environment
  const isNode = typeof window === 'undefined' && typeof process !== 'undefined';

  if (isNode) {
    return loadInNode(baseUrl, preferCompressed);
  }

  // 2. Browser Environment with Native DecompressionStream
  const supportsDecompression = typeof window !== 'undefined' && 'DecompressionStream' in window;

  // Separate URL path and query params for cache busting
  const [urlPath, queryStr] = baseUrl.split('?');
  const querySuffix = queryStr ? `?${queryStr}` : '';
  const cleanBase = urlPath.replace(/\.gz$/, '');
  const gzUrl = cleanBase + '.gz' + querySuffix;
  const jsonUrl = cleanBase + querySuffix;

  if (preferCompressed && supportsDecompression) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(gzUrl, {
        signal: controller.signal,
        headers: { 'Accept': 'application/gzip, application/octet-stream, */*' }
      });
      clearTimeout(id);

      if (response.ok) {
        // Stream decompression through native browser pipeline
        const ds = new DecompressionStream('gzip');
        const decompressedStream = response.body.pipeThrough(ds);
        const responseText = await new Response(decompressedStream).text();
        return JSON.parse(responseText);
      }
    } catch (e) {
      console.warn(`[StreamDecompressor] Failed to load compressed ${gzUrl}, falling back to uncompressed:`, e.message || e);
    }
  }

  // Fallback: Fetch plain uncompressed .json
  const plainResponse = await fetch(jsonUrl, {
    headers: { 'Accept': 'application/json, */*' }
  });

  if (!plainResponse.ok) {
    throw new Error(`[StreamDecompressor] HTTP ${plainResponse.status} loading ${jsonUrl}`);
  }

  return plainResponse.json();
}

/**
 * Node.js helper for local tests and offline auditing
 */
async function loadInNode(baseUrl, preferCompressed) {
  const fs = await import('fs');
  const path = await import('path');
  const zlib = await import('zlib');

  const [urlPath] = baseUrl.split('?');
  const cleanBase = urlPath.replace(/\.gz$/, '');
  let resolvedPath = cleanBase;

  // Try relative to cwd
  if (!fs.existsSync(resolvedPath)) {
    resolvedPath = path.resolve(process.cwd(), cleanBase);
  }

  const gzPath = resolvedPath + '.gz';

  if (preferCompressed && fs.existsSync(gzPath)) {
    const compressedBuf = fs.readFileSync(gzPath);
    const decompressed = zlib.gunzipSync(compressedBuf);
    return JSON.parse(decompressed.toString('utf-8'));
  }

  if (fs.existsSync(resolvedPath)) {
    const raw = fs.readFileSync(resolvedPath, 'utf-8');
    return JSON.parse(raw);
  }

  throw new Error(`[StreamDecompressor] File not found in Node: ${resolvedPath} (or .gz)`);
}

// CommonJS compatibility for Node.js test runners
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fetchAndDecompressJson };
}
