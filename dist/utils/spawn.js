"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnChild = void 0;
const child_process_1 = require("child_process");
const spawnChild = (payload) => {
    const payloadString = JSON.stringify(payload);
    // Spawn a new Node.js process and execute the worker script with parameters
    const child = (0, child_process_1.spawn)("node", ["./dist/worker_spawn.js", payloadString], {
        cwd: process.cwd(),
        detached: true,
        stdio: "inherit",
    });
    // const child = spawn("node", [
    //   "-e",
    //   `(${handle.toString()})(JSON.parse('${payloadString}'))`,
    // ], {
    //   cwd: process.cwd(),
    //   detached: true,
    //   stdio: "inherit",
    // });
    //   const child = spawn("node", ["./worker.js", payloadString]);
    //   child.stdout.setEncoding("utf8");
    //   child.stdout.on("data", (data) => {
    //     console.log(`stdout: ${data}`);
    //   });
    //   child.stderr.on("data", (data) => {
    //     console.log(`stdout: ${data}`);
    //   });
    // Handle process events
    child.on("exit", (code, signal) => {
        if (code === 0) {
            console.log("Worker finished successfully.");
        }
        else {
            console.error(`Worker failed with code ${code} and signal ${signal}.`);
        }
    });
};
exports.spawnChild = spawnChild;
//# sourceMappingURL=spawn.js.map