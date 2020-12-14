import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("return", () => {
                describe("valid", () => {
                    test("type", () => {
                        const data = {
                            foo: {
                                body: ["return Id"],
                                return: "Id",
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: "Id",
                                        returnType: "type",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("field", () => {
                        const data = {
                            foo: {
                                body: ["return MyObj.Id"],
                                return: "Id",
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: "Id",
                                        returnType: "type",
                                        parent: {
                                            type: "type",
                                            value: "MyObj",
                                        },
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("call", () => {
                        const data = {
                            foo: { body: ["return bar()"], return: "Id" },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: "bar",
                                        arguments: [],
                                        returnType: "call",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("empty string as return", () => {
                        const data = {
                            foo: { body: ["return "], return: "Id" },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: return type in expression in function 'foo' cannot be empty."
                        );
                    });
                });
            });
        });
    });
});
