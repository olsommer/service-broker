"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
const bee_queue_1 = __importDefault(require("bee-queue"));
// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
// export const connection = new IORedis(process.env.REDIS_URL ?? "");
// redis.createClient({ url: process.env.REDIS_URL }),
exports.queue = new bee_queue_1.default("introlines", {
    isWorker: true,
    redis: process.env.REDIS_URL,
    removeOnSuccess: true,
    removeOnFailure: true,
});
//# sourceMappingURL=bee.js.map