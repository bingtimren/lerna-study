import { zero } from "./dependency";
import { join } from "path";
import { DependencyType } from "dependency-cruiser";
export function addOne(n: number): number {
  return zero + n + 1;
}

export const joinFunc = join;
export type depType = DependencyType;
