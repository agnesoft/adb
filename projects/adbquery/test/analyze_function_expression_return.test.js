import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("return", () => {
                describe("valid", () => {
                    test("new native", () => {
                        const data = {
                            Id: "int64",
                            foo: {
                                body: ["return 1"],
                                return: "Id",
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
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: 1,
                                        returnType: "number",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("new custom", () => {
                        const data = {
                            Id: "int64",
                            Obj: { fields: ["Id"] },
                            foo: {
                                arguments: ["Id"],
                                body: ["return Obj(Id)"],
                                return: "Obj",
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
                                        type: "return",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "Id",
                                            },
                                        ],
                                        value: "Obj",
                                        returnType: "call",
                                    },
                                ],
                                returnValue: "Obj",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("field", () => {
                        const data = {
                            Id: "int64",
                            MyObj: {
                                fields: ["Id"],
                                functions: {
                                    foo: {
                                        body: ["return Id"],
                                        return: "Id",
                                    },
                                },
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                base: undefined,
                                fields: ["Id"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "Id",
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                returnType: "field",
                                            },
                                        ],
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("field of field", () => {
                        const data = {
                            Id: "int64",
                            SubObj: {
                                fields: ["Id"],
                            },
                            MyObj: {
                                fields: ["SubObj"],
                                functions: {
                                    foo: {
                                        body: ["return SubObj.Id"],
                                        return: "Id",
                                    },
                                },
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            SubObj: {
                                type: "object",
                                name: "SubObj",
                                base: undefined,
                                fields: ["Id"],
                                functions: {},
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                base: undefined,
                                fields: ["SubObj"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "Id",
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                returnType: "field",
                                                parent: {
                                                    type: "field",
                                                    value: "SubObj",
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("variant of field", () => {
                        const data = {
                            Id: "int64",
                            SubObj: {
                                fields: ["Id"],
                            },
                            MyVar: ["Id", "SubObj"],
                            MyObj: {
                                fields: ["MyVar"],
                                functions: {
                                    foo: {
                                        body: [
                                            "MyVar.SubObj.Id = 1",
                                            "return MyVar.SubObj.Id",
                                        ],
                                        return: "Id",
                                    },
                                },
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            SubObj: {
                                type: "object",
                                name: "SubObj",
                                base: undefined,
                                fields: ["Id"],
                                functions: {},
                            },
                            MyVar: {
                                type: "variant",
                                name: "MyVar",
                                variants: ["Id", "SubObj"],
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                base: undefined,
                                fields: ["MyVar"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "Id",
                                        body: [
                                            {
                                                type: "assignment",
                                                left: {
                                                    type: "field",
                                                    value: "Id",
                                                    parent: {
                                                        type: "variant",
                                                        value: "SubObj",
                                                        parent: {
                                                            type: "field",
                                                            value: "MyVar",
                                                        },
                                                    },
                                                },
                                                right: {
                                                    type: "number",
                                                    value: 1,
                                                },
                                            },
                                            {
                                                type: "return",
                                                value: "Id",
                                                returnType: "field",
                                                parent: {
                                                    type: "variant",
                                                    value: "SubObj",
                                                    parent: {
                                                        type: "field",
                                                        value: "MyVar",
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("array from variant from field", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["Id"],
                            MyVar: ["Id", "MyArr"],
                            MyObj: {
                                fields: ["MyVar"],
                                functions: {
                                    foo: {
                                        body: ["return MyVar.MyArr.Id"],
                                        return: "Id",
                                    },
                                },
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            MyArr: {
                                type: "array",
                                name: "MyArr",
                                arrayType: "Id",
                            },
                            MyVar: {
                                type: "variant",
                                name: "MyVar",
                                variants: ["Id", "MyArr"],
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                base: undefined,
                                fields: ["MyVar"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "Id",
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                returnType: "arrayType",
                                                parent: {
                                                    type: "variant",
                                                    value: "MyArr",
                                                    parent: {
                                                        type: "field",
                                                        value: "MyVar",
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("not matching return type", () => {
                        const data = {
                            Obj: {},
                            foo: {
                                body: ["return 1"],
                                return: "Obj",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            `Analyzer: return expression type 'number' does not match return type 'Obj' in function 'foo'.`
                        );
                    });
                });
            });
        });
    });
});

// incompatible return -> throw
