import * as parser from "../compiler/parser.js";

describe("parse", () => {
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

                    expect(parser.parse(data)).toEqual(ast);
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

                    expect(parser.parse(data)).toEqual(ast);
                });
            });

            describe("invalid", () => {
                test("array as functions' type", () => {
                    const data = {
                        MyObj: { functions: [] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'functions' of 'MyObj' invalid ('array', must be 'object')."
                    );
                });

                test("string as function's type", () => {
                    const data = {
                        MyObj: { functions: { foo: "" } },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of function 'MyObj::foo' invalid ('string', must be 'object')."
                    );
                });
            });
        });
    });
});
