import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("assignment", () => {
                describe("valid", () => {
                    test("type = 1", () => {
                        const data = {
                            Id: "int64",
                            foo: {
                                body: ["Id = 1"],
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
                                        type: "assignment",
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

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("type = type", () => {
                        const data = {
                            Id: "int64",
                            From: "int64",
                            foo: {
                                arguments: ["From"],
                                body: ["Id = From"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            From: {
                                type: "alias",
                                name: "From",
                                aliasedType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["From"],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "From",
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

                    test("type = alias", () => {
                        const data = {
                            Id: "int64",
                            From: "Id",
                            MyFrom: "From",
                            foo: {
                                arguments: ["MyFrom"],
                                body: ["Id = MyFrom"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            From: {
                                type: "alias",
                                name: "From",
                                aliasedType: "Id",
                            },
                            MyFrom: {
                                type: "alias",
                                name: "MyFrom",
                                aliasedType: "From",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["MyFrom"],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "MyFrom",
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
                });

                describe("invalid", () => {
                    test("type = <unknown type>", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            foo: {
                                body: ["MyArr = Id"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: value 'Id' used in assignment expression in function 'foo' undeclared."
                        );
                    });

                    test("type = <incompatible type>", () => {
                        const data = {
                            Id: "int64",
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["MyArr = SomeType"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: value 'SomeType' (object) in assignment expression in function 'foo' cannot be assigned to native 'Id' (int64)."
                        );
                    });
                });
            });
        });
    });
});
