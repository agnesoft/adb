import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("function", () => {
        describe("arguments", () => {
            describe("valid", () => {
                test("single", () => {
                    const data = {
                        foo: { arguments: ["arg1"] },
                    };

                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: ["arg1"],
                            body: [],
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });

                test("multiple", () => {
                    const data = {
                        foo: { arguments: ["arg1", "arg2"] },
                    };

                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: ["arg1", "arg2"],
                            body: [],
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });
            });
            describe("invalid", () => {
                test("object as arguments' type", () => {
                    const data = {
                        foo: { arguments: {} },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'arguments' of 'foo' invalid ('object', must be 'array')."
                    );
                });

                test("empty string as argument", () => {
                    const data = {
                        foo: { arguments: [""] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: argument in 'arguments' of 'foo' cannot be empty."
                    );
                });

                test("object as argument", () => {
                    const data = {
                        foo: { arguments: [{}] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: argument in 'arguments' of 'foo' invalid ('object', must be 'string')."
                    );
                });
            });
        });
    });
});
