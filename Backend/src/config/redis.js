import IORedis from "ioredis";

const redisConnection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
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