import * as parser from "../compiler/parser.js";

test("empty", () => {
    const data = {
        MyObj: {},
    };

    const ast = {
        MyObj: {
            type: "object",
            name: "MyObj",
            fields: [],
            functions: {},
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("field", () => {
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

test("fields", () => {
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

test("invalid fields", () => {
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

test("empty field", () => {
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

test("invalid field", () => {
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

test("function", () => {
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

test("functions", () => {
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

test("invalid functions type", () => {
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

test("invalid function type", () => {
    const data = {
        MyObj: { functions: { foo: [] } },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: type of function 'MyObj::foo' invalid ('array', must be 'object')."
    );
});
