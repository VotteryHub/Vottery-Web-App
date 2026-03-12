// ... existing code ...

// Atomic rate limiting with Lua script to prevent race conditions
export const atomicRateLimit = async (
  redis: any,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> => {
  // Lua script for atomic rate limiting
  const luaScript = `
    local key = KEYS[1]
    local limit = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local current_time = tonumber(ARGV[3])
    
    local current = redis.call('GET', key)
    if current == false then
      current = 0
    end
    current = tonumber(current)
    
    if current < limit then
      redis.call('INCR', key)
      if current == 0 then
        redis.call('EXPIRE', key, window)
      end
      return {1, limit - current - 1, current_time + window}
    else
      local ttl = redis.call('TTL', key)
      return {0, 0, current_time + ttl}
    end
  `;

  try {
    const currentTime = Math.floor(Date.now() / 1000);
    const result = await redis.eval(
      luaScript,
      [key],
      [limit.toString(), windowSeconds.toString(), currentTime.toString()]
    );

    return {
      allowed: result[0] === 1,
      remaining: result[1],
      resetAt: result[2]
    };
  } catch (error) {
    console.error('Atomic rate limit error:', error);
    // Fail open with logging
    return { allowed: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }
};

// Enhanced rate limiting with IP tracking
export const checkRateLimit = async (
  identifier: string,
  endpoint: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<void> => {
  const key = `ratelimit:${endpoint}:${identifier}`;
  const result = await atomicRateLimit(redis, key, limit, windowSeconds);

  if (!result.allowed) {
    throw new Error(
      JSON.stringify({
        error: 'Rate limit exceeded',
        remaining: result.remaining,
        resetAt: result.resetAt
      })
    );
  }
};

// ... existing code ...