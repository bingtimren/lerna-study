import { OpinionedCommand } from "..";
import { statSync, readFileSync, rmSync } from "fs";
import { join } from "path";
describe("op-tools/OpinionedCommand", () => {
  let opCmd: OpinionedCommand;
  beforeAll(() => {
    opCmd = new OpinionedCommand(__dirname);
  });
  it("getConfigFileContent() able to get config file content", () => {
    expect(opCmd.getConfigFileContent()).toBeInstanceOf(Buffer);
  });
  it("configDir() able to get config file dir", () => {
    const dirPath = opCmd.configDir;
    const stat = statSync(dirPath);
    expect(stat.isDirectory()).toEqual(true);
  });
  it("getConfigFileContentParsed() able to get config object", () => {
    expect(opCmd.getConfigFileContentParsed().one).toEqual(1);
    expect(
      new OpinionedCommand(__dirname, {
        configFileSuffix: ".js",
      }).getConfigFileContentParsed().one
    ).toEqual(1);
    expect(
      new OpinionedCommand(__dirname, {
        configFileSuffix: ".jsonc",
      }).getConfigFileContentParsed().one
    ).toEqual(1);
  });
  it("localCopyConfig() should copy config file to local", () => {
    opCmd.localCopyConfig("a.json");
    expect(opCmd.configFilePathCopiedLocal).toEqual(
      join(".opToolsConfig", "a.json")
    );
    expect(opCmd.configFilePath).toEqual(opCmd.configFilePathCopiedLocal);
    const expectedLocalPath = join(process.cwd(), ".opToolsConfig/a.json");
    expect(readFileSync(expectedLocalPath).toString()).toEqual(
      opCmd.getConfigFileContent().toString()
    );
    // clean up
    rmSync(expectedLocalPath);
  });
});
