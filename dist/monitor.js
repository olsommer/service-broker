"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bull_1 = require("./utils/bull");
bull_1.queue.on("*", (job, result) => {
    console.log(`Job completed with result ${result}`);
});
//# sourceMappingURL=monitor.js.map