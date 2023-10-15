"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
// Spawn a new Node.js process and execute the worker script with parameters
const producer = (0, child_process_1.spawn)("node", ["./dist/producer.js"], {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit",
});
// Handle process events
producer.on("spawn", () => {
    console.error(`Producer spawned!`);
});
// Handle process events
producer.on("exit", (code, signal) => {
    if (code === 0) {
        console.log("Producer finished successfully.");
    }
    else {
        console.error(`Producer failed with code ${code} and signal ${signal}.`);
    }
});
// Spawn a new Node.js process and execute the worker script with parameters
const worker = (0, child_process_1.spawn)("node", ["./dist/worker_bull.js"], {
    cwd: process.cwd(),
    detached: true,
    stdio: "inherit",
});
// Handle process events
worker.on("spawn", () => {
    console.error(`Worker spawned!`);
});
worker.on("exit", (code, signal) => {
    if (code === 0) {
        console.log("Worker finished successfully.");
    }
    else {
        console.error(`Worker failed with code ${code} and signal ${signal}.`);
    }
});
//# sourceMappingURL=index.js.map