import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("call", () => {
                describe("valid", () => {
                    test("single", () => {
                        const data = {
                            foo: { body: ["bar()"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        arguments: [],
                                        value: "bar",
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("chained", () => {
                        const data = {
                            foo: { body: ["fizz().buzz()"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        arguments: [],
                                        value: "buzz",
                                        parent: {
                                            type: "call",
                                            arguments: [],
                                            value: "fizz",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("method", () => {
                        const data = {
                            foo: { body: ["obj.bar()"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        arguments: [],
                                        value: "bar",
                                        parent: {
                                            type: "type",
                                            value: "obj",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("with argument", () => {
                        const data = {
                            foo: { body: ["bar(arg1)"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "arg1",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("with arguments", () => {
                        const data = {
                            foo: { body: ["bar(arg1, arg2)"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "arg1",
                                            },
                                            {
                                                type: "argument",
                                                value: "arg2",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("empty function name", () => {
                        const data = {
                            foo: { body: ["(arg2)"] },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: function name in function call in 'foo' cannot be empty."
                        );
                    });
                });
            });
        });
    });
});
