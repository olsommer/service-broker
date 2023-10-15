"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queue = void 0;
const bull_1 = __importDefault(require("bull"));
exports.queue = new bull_1.default("introlines", {
    redis: process.env.REDIS_URL,
    limiter: {
        max: 1000,
        duration: 5000,
    },
    defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
    },
});
//# sourceMappingURL=bull.js.map