import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("array", () => {
        describe("valid", () => {
            test("native type", () => {
                const data = {
                    String: ["byte"],
                };

                const ast = {
                    String: {
                        type: "array",
                        name: "String",
                        arrayType: "byte",
                    },
                };

                expect(parser.parse(data)).toEqual(ast);
            });
        });
        describe("invalid", () => {
            test("empty string as array type", () => {
                const data = {
                    MyArr: [""],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: type of array 'MyArr' cannot be empty."
                );
            });

            test("object as array type", () => {
                const data = {
                    MyArr: [{}],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: type of array 'MyArr' invalid ('object', must be 'string')."
                );
            });
        });
    });
});
