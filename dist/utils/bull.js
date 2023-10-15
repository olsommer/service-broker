"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
// Redis connection details
// https://github.com/redis/ioredis/blob/v4/API.md
exports.connection = new ioredis_1.default(process.env.REDIS_URL ?? "", {
    maxRetriesPerRequest: 0,
});
exports.queue = new bullmq_1.Queue("introlines", {
    connection: exports.connection,
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: 1000,
    },
    // redis: process.env.REDIS_URL,
    // limiter: {
    //   max: 1000,
    //   duration: 5000,
    // },
    // defaultJobOptions: {
    //   removeOnComplete: true,
    //   removeOnFail: true,
    // },
});
//# sourceMappingURL=bull.js.map