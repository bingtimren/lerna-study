const nixt = require("nixt");

nixt()
  .cwd("./testProj")
  .exec("git reset --hard init")
  .exec("git clean -fd")
  .exec("cp -r ../testProjChange/* .")
  .run("git commit -a --no-edit")
  .stdout("BSSUILD SCRSSIPT EXESSCUTED")
  .on("Select the type of change that you're committing")
  .respond("\n")
  .on("What is the scope of this change")
  .respond("scope\n")
  .on("Write a short, imperative tense description of the change")
  .respond("short desc\n")
  .on("Provide a longer description of the change")
  .respond("long desc\n")
  .on("Are there any breaking changes")
  .respond("N\n")
  .on("Does this change affect any open issues")
  .respond("N\n")
  .on("")
  .respond("\n")
  .on("")
  .respond("\n")
  .on("")
  .respond("\n")
  .on("")
  .respond("\n")
  .stdout("(scope): short desc")
  .end();

//     /\[master \w+] \w+\(scope\)\: short desc/,
//     { timeoutInMs: 10000 }
//   );
//   await gitCommit;
// });

// test("pipe", async () => {
//   const bash = execa.command("bash");
//   pt.echoChildProcessOutput(bash);
//   bash.stdin!.write("\n");
//   bash.stdin!.write("echo YES\n");
//   await pt.promiseOutputPattern(bash, /YES/, { timeoutInMs: 1000 });
//   bash.stdin!.write("pwd\n");
//   await pt.promiseOutputPattern(bash, /e2etest/, { timeoutInMs: 1000 });
//   bash.stdin!.write("ls\n");
//   await pt.promiseOutputPattern(bash, /package.json/, { timeoutInMs: 1000 });

//   bash.stdin!.write("nano\n");
//   await pt.promiseOutputPattern(bash, /GNU nano/, { timeoutInMs: 1000 });
//   bash.stdin!.write("\u0018"); // ctrl+X
//   bash.stdin!.write("exit\n");
//   await pt.promiseExit(bash);
// });
