import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("addition", () => {
                describe("valid", () => {
                    test("type += 1", () => {
                        const data = {
                            Id: "int64",
                            foo: {
                                body: ["Id += 1"],
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
                                        type: "addition",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "number",
                                            value: 1,
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });

                    test("array += value", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            foo: {
                                arguments: ["Id"],
                                body: ["MyArr += Id"],
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
                                arrayType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["Id"],
                                body: [
                                    {
                                        type: "addition",
                                        left: {
                                            type: "new",
                                            value: "MyArr",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "Id",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });

                    test("array += array", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            OtherArr: "MyArr",
                            foo: {
                                arguments: ["OtherArr"],
                                body: ["MyArr += OtherArr"],
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
                                arrayType: "int64",
                            },
                            OtherArr: {
                                type: "alias",
                                name: "OtherArr",
                                aliasedType: "MyArr",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["OtherArr"],
                                body: [
                                    {
                                        type: "addition",
                                        left: {
                                            type: "new",
                                            value: "MyArr",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "OtherArr",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("array += <unknown value>", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            foo: {
                                body: ["MyArr += Id"],
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext).toThrow(
                            "Analyzer: value 'Id' used in addition expression in function 'foo' undeclared."
                        );
                    });

                    test("array += <incompatible type>", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["MyArr += SomeType"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: value 'SomeType' (object) in addition expression in function 'foo' cannot be added to array 'MyArr' (int64)."
                        );
                    });
                });
            });
        });
    });
});
