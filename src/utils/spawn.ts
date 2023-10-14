import { spawn } from "child_process";
import { handle, Payload } from "../worker";

export const spawnChild = (payload: { [key: string]: any }) => {
  const payloadString = JSON.stringify(payload);

  // Spawn a new Node.js process and execute the worker script with parameters
  const child = spawn("node", ["./dist/worker_spawn.js", payloadString], {
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
    } else {
      console.error(`Worker failed with code ${code} and signal ${signal}.`);
    }
  });
};
