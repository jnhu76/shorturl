// lib/redis.ts
import { createClient } from 'redis';

class RedisClient {
  private static instance: ReturnType<typeof createClient>;

  public static async getInstance() {
    if (!this.instance) {
      this.instance = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      this.instance.on('error', (err) =>
        console.error('Redis Client Error:', err)
      );

      await this.instance.connect();
    }

    return this.instance;
  }
}

export default RedisClient;
