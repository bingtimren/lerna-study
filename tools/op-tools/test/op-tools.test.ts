import { OpinionedCommand, defaultOptions } from "../src/op-tools-base";
import { statSync, readFileSync, rmSync } from "fs";
import { join } from "path";
import { Command } from "commander";

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
    it(`chalkedExeca runs a normal exiting script should return nothing (uses open-cli for testing)`, async () => {
      const exitResult = await opCmd.chalkedExeca(
        "open-cli",
        ["--version"],
        true
      );
      expect(exitResult).toBeUndefined();
    });
    it(`chalkedExeca runs a normal exiting script should return nothing (depcruise for testing)`, async () => {
      const exitResult = await opCmd.chalkedExeca(
        "depcruise",
        ["--help"],
        true
      );
      expect(exitResult).toBeUndefined();
    });
    it(`chalkedExeca runs a normal exiting script should return nothing (using defaults and -v)`, async () => {
      opCmd.parse(["node", "op-tools.js", "-v", "list"]);
      const exitResult = await opCmd.chalkedExeca("ls");
      expect(exitResult).toBeUndefined();
      const content = mockedLog.mock.calls
        .map((msgs) => msgs.join("/"))
        .join(" ");
      expect(content.match(/Running command: .+ls\s+/)?.length).toBeGreaterThan(
        0
      );
    });
    it(`chalkedExeca runs a normal exiting script should return nothing (using defaults and -v)`, async () => {
      opCmd.parse(["node", "op-tools.js", "-v", "list"]);
      const exitResult = await opCmd.chalkedExeca("ls", [".", "-d"]);
      expect(exitResult).toBeUndefined();
      const content = mockedLog.mock.calls
        .map((msgs) => msgs.join("/"))
        .join(" ");
      expect(content.match(/ls\s+\.\s+-d/)?.length).toBeGreaterThan(0);
    });

    it(`chalkedExeca runs an abnormal exiting script should exit (ls nonexist)`, async () => {
      const exitResult = await opCmd.chalkedExeca(
        "ls",
        ["nonexist-file"],
        true
      );
      expect(mockedExit).toHaveBeenCalledWith(2);
    });
    it(`chalkedExeca runs an abnormal exiting script should exit (nonexist)`, async () => {
      const exitResult = await opCmd.chalkedExeca("sdqefqweqweqwedqwedqwe");
      expect(mockedExit).toHaveBeenCalledWith(-2);
    });

    it(`chalkedExeca runs a abnormal exiting script should return the process (ls nonexist)`, async () => {
      expect(
        opCmd.chalkedExeca("ls", ["nonexist-file"], false)
      ).rejects.toBeInstanceOf(Error);
    });
  }
);
