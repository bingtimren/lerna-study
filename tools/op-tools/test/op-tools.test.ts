import { OpinionedCommand, defaultOptions } from "../src/op-tools-base";
import { statSync, readFileSync, rmSync } from "fs";
import { join } from "path";
import { Command } from "commander";

// const somethingWrong : string = 12;

const mockedLog = jest.spyOn(console, "log");
const mockedError = jest.spyOn(console, "error");
const mockedExit = jest.spyOn(process, "exit");

const testTable: [boolean, string][] = [];
for (const useLocalCopy of [true, false]) {
  for (const suffix of [".js", ".json", ".jsonc"]) {
    testTable.push([useLocalCopy, suffix]);
  }
}

afterAll(() => {
  mockedLog.mockRestore();
  mockedError.mockRestore();
  mockedExit.mockRestore();
  rmSync(".opToolsConfig", { recursive: true, force: true });
});

describe.each(testTable)(
  "(local-copy:%p suffix:%p) op-tools/OpinionedCommand",
  (useLocalCopy: boolean, suffix: string) => {
    let opCmd: OpinionedCommand;

    beforeEach(() => {
      mockedLog.mockReset();
      mockedError.mockReset();
      mockedExit.mockReset();
      opCmd =
        suffix !== defaultOptions.configFileSuffix
          ? new OpinionedCommand(__dirname, {
              configFileSuffix: suffix,
            })
          : new OpinionedCommand(__dirname);
      if (useLocalCopy) {
        opCmd.localCopyConfig("localCopyTest" + suffix);
      }
    });
    it(`getConfigFileContent() able to get config file content`, () => {
      expect(opCmd.getConfigFileContent()).toBeInstanceOf(Buffer);
    });
    it(`getter configDir able to get config file dir`, () => {
      const dirPath = opCmd.configDir;
      const stat = statSync(dirPath);
      expect(stat.isDirectory()).toEqual(true);
      const fileStat = statSync(join(dirPath, "default.json"));
      expect(fileStat.isFile()).toEqual(true);
    });
    it(`getter configFilePath able to get config file`, () => {
      expect(statSync(opCmd.configFilePath).isFile()).toEqual(true);
    });
    it(`getter configFilePathInPackage able to get config file`, () => {
      expect(statSync(opCmd.configFilePathInPackage).isFile()).toEqual(true);
    });
    it(`getter configFilePathCopiedLocal able to get config file, if already locally copied`, () => {
      if (useLocalCopy) {
        expect(
          statSync(<string>opCmd.configFilePathCopiedLocal).isFile()
        ).toEqual(true);
      } else {
        expect(opCmd.configFilePathCopiedLocal).toBeUndefined();
      }
    });
    it(`getter constructOptions able to get the options`, () => {
      expect(opCmd.constructOptions.configFileSuffix).toEqual(suffix);
    });
    it(`getConfigFileContentParsed() able to get config object`, () => {
      expect((opCmd.getConfigFileContentParsed() as any).one).toEqual(1);
    });
    it(`able to handle "list" command with '-v' parameter`, () => {
      opCmd.parse(["node", "op-tools.js", "-v", "list"]);
      expect(console.log).toHaveBeenCalledWith("default");
      expect(console.log).toHaveBeenCalledWith("alternate");
      const matchedLog = mockedLog.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/Pre-configuration file dir\:/);
      expect(matchedLog !== null && matchedLog.length === 1).toEqual(true);
    });
    it(`able to handle "list" command`, () => {
      opCmd.parse(["node", "op-tools.js", "list"]);
      expect(console.log).toHaveBeenCalledWith("default");
      expect(console.log).toHaveBeenCalledWith("alternate");
    });
    it(`able to handle "print" command`, () => {
      opCmd.parse(["node", "op-tools.js", "print"]);
      const logMatch = mockedLog.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/\"?one\"?\s*\:\s*1\s*,?/);
      expect(logMatch !== null && logMatch.length === 1).toEqual(true);
    });
    it(`able to handle "print" command with -c parameter`, () => {
      opCmd.parse(["node", "op-tools.js", "-c", "alternate", "print"]);
      const logMatch = mockedLog.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/\"?alternateOne\"?\s*\:\s*1\s*,?/);
      expect(logMatch !== null && logMatch.length === 1).toEqual(true);
    });
    it(`able to handle "print" command with -c -v parameter`, () => {
      opCmd.parse(["node", "op-tools.js", "-c", "alternate", "-v", "print"]);
      const logMatch = mockedLog.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/\"?alternateOne\"?\s*\:\s*1\s*,?/);
      expect(logMatch !== null && logMatch.length === 1).toEqual(true);
      const logMatch2 = mockedLog.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/Pre\-config\: .*alternate.*Pre-config File\:.*alternate/);
      expect(logMatch2 !== null && logMatch2.length === 1).toEqual(true);
    });
    it(`able to access program from getter`, () => {
      expect(opCmd.program).toBeInstanceOf(Command);
    });
    it(`throws if config file of unknown type`, () => {
      const opCmdIllegal = new OpinionedCommand(__dirname, {
        configFileSuffix: ".unknown",
      });
      expect(() => {
        opCmdIllegal.getConfigFileContentParsed();
      }).toThrowError(/unknown file type/);
    });
    it(`throws if copy local is provided with an inconsistent suffix`, () => {
      expect(() => {
        opCmd.localCopyConfig("file.unknown");
      }).toThrowError(/has different suffix/);
    });
    it(`throws if copy local is provided with an invalid dir`, () => {
      expect(() => {
        opCmd.localCopyConfig("file" + suffix, "package.json");
      }).toThrowError(/is not a directory/);
    });
    it(`chalkedExecSync runs a command should return undefined`, () => {
      opCmd.parse(["node", "op-tools.js", "-v", "list"]);
      expect(opCmd.chalkedExecSync("ls")).toEqual(undefined);
      const logMatch = mockedLog.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/Running command: .*ls/);
      expect(logMatch !== null && logMatch.length === 1).toEqual(true);
    });
    it(`chalkedExecSync runs a failing command should return error`, () => {
      opCmd.parse(["node", "op-tools.js", "list"]);
      expect(
        Object.keys(
          opCmd.chalkedExecSync("not-a-command-absolutely", false) as Object
        )
      ).toContain("status");
      const logMatch = mockedError.mock.calls
        .map((messages) => messages.join(" "))
        .join(" ")
        .match(/ERROR: command failed: .*not-a-command/);
      expect(logMatch !== null && logMatch.length === 1).toEqual(true);
    });
    it(`chalkedExecSync runs a failing command should exit`, () => {
      opCmd.parse(["node", "op-tools.js", "list"]);
      opCmd.chalkedExecSync("not-a-command-absolutely");
      expect(mockedExit.mock.calls[0][0]).toBeGreaterThan(0);
    });
    it(`chalkFork runs a normal exiting script should return nothing`, async () => {
      const exitResult = await opCmd.chalkedFork(
        join(__dirname, "forkTest.js"),
        ["NORMAL"]
      );
      expect(exitResult).toBeUndefined();
    });
    it(`chalkFork runs a non-zero exiting script should return the child process`, async () => {
      const exitResult = await opCmd.chalkedFork(
        join(__dirname, "forkTest.js"),
        ["NONZERO"],
        false
      );
      expect(exitResult && exitResult.exitCode === 1).toEqual(true);
    });
    it(`chalkFork runs an interrupted script should return the child process`, async () => {
      const exitResult = await opCmd.chalkedFork(
        join(__dirname, "forkTest.js"),
        ["KILL"],
        false
      );
      expect(exitResult && exitResult.signalCode === "SIGTERM").toEqual(true);
    });
    it(`chalkFork runs a normal exiting script should return nothing, verbose`, async () => {
      opCmd.parse(["node", "op-tools.js", "-v", "list"]);
      const exitResult = await opCmd.chalkedFork(
        join(__dirname, "forkTest.js"),
        ["NORMAL"]
      );
      expect(exitResult).toBeUndefined();
    });
    it(`chalkFork runs a non-zero exiting script should exit`, async () => {
      const exitResult = await opCmd.chalkedFork(
        join(__dirname, "forkTest.js"),
        ["NONZERO"],
        true
      );
      expect(mockedExit).toHaveBeenLastCalledWith(1);
    });
    it(`chalkFork runs an interrupted script should exit`, async () => {
      const exitResult = await opCmd.chalkedFork(
        join(__dirname, "forkTest.js"),
        ["KILL"],
        true
      );
      expect(mockedExit).toHaveBeenLastCalledWith(1);
    });
  }
);
