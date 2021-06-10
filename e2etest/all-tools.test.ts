import * as fs from "fs";
import * as path from "path";
import * as execa from "execa";
import * as pt from "child-process-toolbox";

jest.setTimeout(60000);

// beforeEach(async () => {
//   // clean up but keep husky, yarn.lock and node_modules to save time
//   process.chdir(path.join(__dirname, "testProj"));
//   expect(
//     fs.statSync(".git").isDirectory() &&
//       fs.statSync(".husky").isDirectory() &&
//       fs.statSync("node_modules/@bingsjs").isDirectory() &&
//       fs
//         .readFileSync(".git/config")
//         .toString()
//         .match(/hooksPath \= \.husky/) !== null
//   ).toEqual(true);
//   execa.commandSync("git reset --hard init");
//   execa.commandSync("git clean -fd");
//   execa.commandSync("cp -r ../testProjChange/* .", { shell: true });
// });

// test("op-husky and git hooks - lint and commitizen", async () => {
//   const gitCommit = execa.command("git commit -a --no-edit", { shell: true });
//   pt.echoChildProcessOutput(gitCommit);

//   await Promise.all([
//     pt.promiseOutputPattern(gitCommit, /BUILD SCRIPT EXECUTED/, {
//       timeoutInMs: 10000,
//     }),
//     pt.promiseOutputPattern(gitCommit, /TEST SCRIPT EXECUTED/, {
//       timeoutInMs: 10000,
//     }),
//     pt.promiseOutputPattern(
//       gitCommit,
//       /Select the type of change that you're committing/,
//       { timeoutInMs: 10000 }
//     ),
//   ]);
//   process.stdin.setRawMode(true);
//   // process.stdin.resume();
//   process.stdin.write("\r\n")
//   gitCommit.stdin!.write("\r\n"); // select a type

//   await pt.promiseOutputPattern(gitCommit, /What is the scope of this change/, {
//     timeoutInMs: 10000,
//   });
//   gitCommit.stdin?.write("scope\n");
//   await pt.promiseOutputPattern(
//     gitCommit,
//     /Write a short, imperative tense description of the change/,
//     { timeoutInMs: 10000 }
//   );
//   gitCommit.stdin?.write("short desc\n");

//   await pt.promiseOutputPattern(
//     gitCommit,
//     /Provide a longer description of the change/,
//     { timeoutInMs: 10000 }
//   );
//   gitCommit.stdin?.write("long desc\n");

//   await pt.promiseOutputPattern(gitCommit, /Are there any breaking changes/, {
//     timeoutInMs: 10000,
//   });
//   gitCommit.stdin?.write("N\n");

//   await pt.promiseOutputPattern(
//     gitCommit,
//     /Does this change affect any open issues/,
//     { timeoutInMs: 10000 }
//   );
//   gitCommit.stdin?.write("N\n");

//   await pt.promiseOutputPattern(
//     gitCommit,
//     /\[master \w+] \w+\(scope\)\: short desc/,
//     { timeoutInMs: 10000 }
//   );
//   await gitCommit;
// });

test("pipe", async () => {
  const bash = execa.command("bash");
  pt.echoChildProcessOutput(bash);
  bash.stdin!.write("\n");
  bash.stdin!.write("echo YES\n");
  await pt.promiseOutputPattern(bash, /YES/, { timeoutInMs: 1000 });
  bash.stdin!.write("pwd\n");
  await pt.promiseOutputPattern(bash, /e2etest/, { timeoutInMs: 1000 });
  bash.stdin!.write("pwd\n");
  await pt.promiseOutputPattern(bash, /GNU nano/, { timeoutInMs: 1000 });
  bash.stdin!.write("\u0018"); // ctrl+X
  bash.stdin!.write("exit\n");
  await pt.promiseExit(bash);
});
