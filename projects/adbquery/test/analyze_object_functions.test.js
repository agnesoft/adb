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
                        MyObj: {
                            fields: ["Id"],
                            functions: {
                                foo: {
                                    arguments: ["arg1"],
                                    body: ["Id = arg1"],
                                },
                                bar: {
                                    return: "Id",
                                },
                            },
                        },
                    };

                    const ast = {
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            fields: ["Id"],
                            functions: {
                                foo: {
                                    type: "function",
                                    name: "foo",
                                    arguments: ["arg1"],
                                    body: [
                                        {
                                            type: "assignment",
                                            left: {
                                                type: "type",
                                                value: "Id",
                                            },
                                            right: {
                                                type: "type",
                                                value: "arg1",
                                            },
                                        },
                                    ],
                                },
                                bar: {
                                    type: "function",
                                    name: "bar",
                                    arguments: [],
                                    body: [],
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
