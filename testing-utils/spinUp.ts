import { execSync, spawn, ChildProcessWithoutNullStreams } from "child_process";

// This tracks all the processes that we spawn from this file.
// Used to clean up processes when exiting this program.
const p: { [key: string]: ChildProcessWithoutNullStreams } = {};

export const spinChain = async (
  bin: string,
  key: string
): Promise<ChildProcessWithoutNullStreams> => {
  console.log("chain starting");
  const args = ["--dev"];
  const process = spawn(bin, args);
  process.stderr.on("data", async function (chunk) {
    const message = chunk.toString();
    let ready;
    while (!ready) {
      ready =
        message.includes("Running JSON-RPC WS server:") ||
        message.includes("Listening for new connections");
      await sleep(1000);
    }
  });
  return process;
};

function sleep(durationInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationInMs));
}
