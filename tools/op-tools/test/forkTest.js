console.log(`forkTest.js called with process.argv=${process.argv}`);
if (process.argv[2] === "NORMAL") {
  console.log(`forkTest: exiting 0`);
  process.exit(0);
} else if (process.argv[2] === "NONZERO") {
  console.log(`forkTest: exiting 1`);
  process.exit(1);
} else if (process.argv[2] === "KILL") {
  setTimeout(() => {
    console.log(`forkTest: killing`);
    process.kill(process.pid, "SIGTERM");
  });
  console.log(`forkTest: enters into sleep`);
  setTimeout(() => {
    console.log(`forkTest: exiting 1 after sleep`);
    process.exit(1);
  }, 1000000000);
} else {
  process.exit(2);
}
