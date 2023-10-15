import { queue } from "./utils/bull";

queue.on("*", (job, result) => {
  console.log(`Job completed with result ${result}`);
});
