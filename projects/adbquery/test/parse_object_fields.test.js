import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("object", () => {
        describe("fields", () => {
            describe("valid", () => {
                test("single", () => {
                    const data = {
                        MyObj: {
                            fields: ["field1"],
                        },
                    };

                    const ast = {
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            fields: ["field1"],
                            functions: {},
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });

                test("multiple", () => {
                    const data = {
                        MyObj: {
                            fields: ["field1", "field2"],
                        },
                    };

                    const ast = {
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            fields: ["field1", "field2"],
                            functions: {},
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });
            });

            describe("invalid", () => {
                test("object as fields' type", () => {
                    const data = {
                        MyObj: {
                            fields: {},
                        },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'fields' of 'MyObj' invalid ('object', must be 'array')."
                    );
                });

                test("empty string as field", () => {
                    const data = {
                        MyObj: {
                            fields: [""],
                        },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: field in 'fields' of 'MyObj' cannot be empty."
                    );
                });

                test("object as field", () => {
                    const data = {
                        MyObj: {
                            fields: [{}],
                        },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: field of 'MyObj' invalid ('object', must be 'string')."
                    );
                });
            });
        });
    });
});
