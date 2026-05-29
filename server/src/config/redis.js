import { createClient } from 'redis';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on("error", 
    (err) => {
        console.error("Redis error", err);
    }
);

redisClient.on("connect", 
    () => {
        console.log("Redis connected")
    }
);

await redisClient.connect();

export default redisClient;