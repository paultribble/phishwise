import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize only if env vars present
const redis = process.env.UPSTASH_REDIS_REST_URL ? new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
}) : null;

export async function checkRateLimit(
  key: string,
  limit: number = 10,
  windowMs: number = 60000
): Promise<{ success: boolean; remaining: number; reset: number }> {
  // In development or if Redis unavailable, skip rate limiting
  if (!redis || process.env.NODE_ENV === 'development') {
    return { success: true, remaining: limit, reset: 0 };
  }

  try {
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMs}ms`),
    });

    const result = await ratelimit.limit(key);
    return {
      success: result.success,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // Fail open if rate limiter unavailable
    console.error('Rate limit check failed:', error);
    return { success: true, remaining: limit, reset: 0 };
  }
}

/** Extract client IP from request headers */
export function getClientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
