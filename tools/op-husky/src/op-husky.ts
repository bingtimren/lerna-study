import { OpinionedCommand } from "@bingsjs/op-tools";
import { join } from "path";

const opCmd = new OpinionedCommand(join(__dirname, ".."));
opCmd.install;

opCmd.parse(process.argv);
