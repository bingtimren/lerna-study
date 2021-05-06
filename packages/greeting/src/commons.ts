/**
 * @packageDocumentation
 * Artifacts shared by both front-end and backend
 */
// try to 'uglify' and test git commit hook to prettier
import { WORD } from '@bingsjs/word';
/**
 * Just an example function
 */
export function greeting(name: string): string {
  return `${WORD}, ${name}!!?!!`;
}

// to test eslint
/* eslint-disable no-var */
var n=1;