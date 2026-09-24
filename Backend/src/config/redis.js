import IORedis from "ioredis";

const redisConnection = new IORedis({
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
});

redisConnection.on("error", (err) => {
    console.error("Redis client error:", err.message);
});

const connectRedis = async () => {
    try {
        await redisConnection.ping();
        console.log("Redis connected successfully");
    } catch (error) {
        console.error("Redis connection failed:", error);
        throw error;
    }
};

export { redisConnection, connectRedis };