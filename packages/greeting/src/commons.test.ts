import * as commons from './commons';

describe('Example Test Suite', () => {
  it('Example test case', () => {
    const greetingResult = commons.greeting('someone');
    expect(greetingResult.indexOf('someone') >= 0).toBe(true);
    expect(greetingResult.indexOf('Hi') === 0).toBe(true);
  });
});

// to test eslint
// Although below is a lint error, "**/*.test.ts" is ignored
var n=1;