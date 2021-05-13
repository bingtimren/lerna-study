import * as words from "..";

describe("@bingsjs/words", () => {
  it("should export word hi", () => {
    expect(typeof words.hi).toBe("string");
  });
});
