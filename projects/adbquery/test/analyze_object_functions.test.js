import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("object", () => {
        describe("functions", () => {
            describe("valid", () => {
                test("single simple", () => {
                    const data = {
                        MyObj: {
                            functions: {
                                foo: { body: [] },
                            },
                        },
                    };

                    const ast = {
                        MyObj: {
                            type: "object",
                            name: "MyObj",
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
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze()).toEqual(ast);
                });

                test("multiple with argument", () => {
                    const data = {
                        Id: "int64",
                        IdAlias: "Id",
                        MyObj: {
                            fields: ["Id"],
                            functions: {
                                foo: {
                                    arguments: ["IdAlias"],
                                    body: ["Id = IdAlias"],
                                },
                                bar: {
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
                        IdAlias: {
                            type: "alias",
                            name: "IdAlias",
                            aliasedType: "Id",
                        },
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            fields: ["Id"],
                            functions: {
                                foo: {
                                    type: "function",
                                    name: "foo",
                                    arguments: ["IdAlias"],
                                    body: [
                                        {
                                            type: "assignment",
                                            left: {
                                                type: "field",
                                                realType: "int64",
                                                astType: "native",
                                                value: "Id",
                                            },
                                            right: {
                                                type: "argument",
                                                realType: "int64",
                                                astType: "native",
                                                value: "IdAlias",
                                            },
                                        },
                                    ],
                                    returnValue: undefined,
                                },
                                bar: {
                                    type: "function",
                                    name: "bar",
                                    arguments: [],
                                    body: [
                                        {
                                            type: "return",
                                            value: "Id",
                                            realType: "int64",
                                            astType: "native",
                                            returnType: "field",
                                        },
                                    ],
                                    returnValue: "Id",
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
        });
    });
});
