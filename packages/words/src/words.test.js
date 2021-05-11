"use strict";
exports.__esModule = true;
var words = require("./words");
describe("@bingsjs/words", function () {
    it("should export word hi", function () {
        expect(typeof words.hi).toBe("string");
    });
});
