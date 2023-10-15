import { spawn } from "child_process";

// Spawn a new Node.js process and execute the worker script with parameters
const producer = spawn("node", ["./dist/producer.js"], {
  cwd: process.cwd(),
  detached: true,
  stdio: "inherit",
});

// Handle process events
producer.on("exit", (code, signal) => {
  if (code === 0) {
    console.log("Producer finished successfully.");
  } else {
    console.error(`Producer failed with code ${code} and signal ${signal}.`);
  }
});

// Spawn a new Node.js process and execute the worker script with parameters
const worker = spawn("node", ["./dist/worker_bull.js"], {
  cwd: process.cwd(),
  detached: true,
  stdio: "inherit",
});

// Handle process events
worker.on("exit", (code, signal) => {
  if (code === 0) {
    console.log("Worker finished successfully.");
  } else {
    console.error(`Worker failed with code ${code} and signal ${signal}.`);
  }
});

// Spawn a new Node.js process and execute the worker script with parameters
const monitor = spawn("node", ["./dist/monitor.js"], {
  cwd: process.cwd(),
  detached: true,
  stdio: "inherit",
});

// Handle process events
producer.on("exit", (code, signal) => {
  if (code === 0) {
    console.log("Monitor finished successfully.");
  } else {
    console.error(`Monitor failed with code ${code} and signal ${signal}.`);
  }
});
