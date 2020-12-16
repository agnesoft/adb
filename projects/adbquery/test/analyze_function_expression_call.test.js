import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("call", () => {
                describe("valid", () => {
                    test("free function", () => {
                        const data = {
                            foo: {
                                body: [],
                            },
                            bar: {
                                body: ["foo()"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [],
                                returnValue: undefined,
                            },
                            bar: {
                                type: "function",
                                name: "bar",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "foo",
                                        arguments: [],
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("free function with argument", () => {
                        const data = {
                            Id: "int64",
                            foo: {
                                arguments: ["int64"],
                                body: [],
                            },
                            bar: {
                                body: ["foo(1)"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["int64"],
                                body: [],
                                returnValue: undefined,
                            },
                            bar: {
                                type: "function",
                                name: "bar",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        realType: undefined,
                                        astType: undefined,
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: "1",
                                                realType: "int64",
                                                astType: "native",
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("method", () => {
                        const data = {
                            SomeObj: {
                                functions: {
                                    foo: {
                                        body: [],
                                    },
                                },
                            },
                            bar: {
                                arguments: ["SomeObj"],
                                body: ["SomeObj.foo()"],
                            },
                        };

                        const ast = {
                            SomeObj: {
                                type: "object",
                                name: "SomeObj",
                                fields: [],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        body: [],
                                        returnValue: undefined,
                                    },
                                },
                            },
                            bar: {
                                type: "function",
                                name: "bar",
                                arguments: ["SomeObj"],
                                body: [
                                    {
                                        type: "method",
                                        value: "foo",
                                        astType: undefined,
                                        realType: undefined,
                                        arguments: [],
                                        parent: {
                                            type: "argument",
                                            value: "SomeObj",
                                            astType: "object",
                                            realType: "SomeObj",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("constructor", () => {
                        const data = {
                            Id: "int64",
                            Obj: { fields: ["Id"] },
                            foo: {
                                arguments: ["Id"],
                                body: ["Obj(Id)"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            Obj: {
                                type: "object",
                                name: "Obj",
                                fields: ["Id"],
                                functions: {},
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["Id"],
                                body: [
                                    {
                                        type: "constructor",
                                        realType: "Obj",
                                        astType: "object",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "Id",
                                                realType: "int64",
                                                astType: "native",
                                            },
                                        ],
                                        value: "Obj",
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("incorrect argument", () => {
                        const data = {
                            Id: "int64",
                            Obj: {},
                            foo: {
                                arguments: ["Obj"],
                            },
                            bar: {
                                arguments: ["Id"],
                                body: ["foo(Id)"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: invalid expression in function 'bar'. Cannot assign 'Id' (aka int64 [native]) to 'Obj' (aka Obj [object])."
                        );
                    });

                    test("non-function type", () => {
                        const data = {
                            Arr: ["int64"],
                            foo: {
                                body: ["Arr()"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: invalid expression in function 'foo'. Cannot call 'Arr' (not a function)."
                        );
                    });
                });
            });
        });
    });
});
