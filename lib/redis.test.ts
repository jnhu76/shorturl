// lib/redis.test.ts
import RedisClient from './redis.js';

async function testRedisConnection() {
  try {
    const redis = await RedisClient.getInstance();

    // 测试基本的 SET 和 GET 操作
    await redis.set('test_key', 'test_value');
    const value = await redis.get('test_key');
    console.log(
      'Test GET/SET:',
      value === 'test_value' ? 'PASSED ✅' : 'FAILED ❌'
    );

    // 测试过期时间设置
    await redis.set('test_expire', 'will_expire', {
      EX: 1, // 1秒后过期
    });
    console.log('Test EXPIRE: Set with expiration ✅');

    // 等待2秒确认过期
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const expiredValue = await redis.get('test_expire');
    console.log(
      'Test EXPIRE:',
      expiredValue === null ? 'PASSED ✅' : 'FAILED ❌'
    );

    // 清理测试数据
    await redis.del('test_key');

    console.log('All Redis tests completed successfully ✅');
  } catch (error) {
    console.error('Redis test failed ❌:', error);
  } finally {
    // 注意：在实际应用中，我们通常不会断开连接，因为这是一个单例
    // 但在测试中，我们可能希望清理连接
    const redis = await RedisClient.getInstance();
    await redis.quit();
  }
}

// 运行测试
console.log('Starting Redis connection test...');
testRedisConnection();
