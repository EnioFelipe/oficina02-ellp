const buckets = new Map();

export function clearRateLimitBuckets() {
  buckets.clear();
}

export function rateLimitByIp({ windowMs = 60000, max = 20 } = {}) {
  return (req, _res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const bucket = buckets.get(key) || { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return next({ statusCode: 429, message: 'Muitas tentativas. Tente novamente em instantes.' });
    }

    next();
  };
}
