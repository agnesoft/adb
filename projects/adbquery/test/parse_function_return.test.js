import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("function", () => {
        describe("return", () => {
            describe("valid", () => {
                test("custom type", () => {
                    const data = {
                        foo: { return: "Id" },
                    };

                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: [],
                            body: [],
                            returnValue: "Id",
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });
            });

            describe("invalid", () => {
                test("empty string as return", () => {
                    const data = {
                        foo: { return: "" },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: 'return' of 'foo' cannot be empty."
                    );
                });

                test("object as return", () => {
                    const data = {
                        foo: { return: {} },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'return' of 'foo' invalid ('object', must be 'string')."
                    );
                });
            });
        });
    });
});
