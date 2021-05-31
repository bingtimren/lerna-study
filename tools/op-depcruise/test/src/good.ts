import { zero } from "./lib/dependency";
import { another } from "./lib/another-dependency";
import { join } from "path";
import { DependencyType } from "dependency-cruiser";
export function addOne(n: number): number {
  return zero + n + 1;
}
export const ano = another;
export const joinFunc = join;
export type depType = DependencyType;
