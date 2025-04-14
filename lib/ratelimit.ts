import { redis } from "./redis";
import { Ratelimit } from "@upstash/ratelimit";

export const rateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "10s")
})