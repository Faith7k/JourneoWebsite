interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  identifier: string,
  max: number = 5,
  windowMs: number = 60000
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = store[identifier];

  if (!record || now > record.resetAt) {
    store[identifier] = {
      count: 1,
      resetAt: now + windowMs,
    };
    return {
      success: true,
      remaining: max - 1,
      resetAt: now + windowMs,
    };
  }

  if (record.count >= max) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count++;
  return {
    success: true,
    remaining: max - record.count,
    resetAt: record.resetAt,
  };
}

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (now > store[key].resetAt) {
      delete store[key];
    }
  });
}, 600000);

