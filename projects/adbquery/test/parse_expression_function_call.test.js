import * as parser from "../compiler/parser.js";

test("function call", () => {
    const data = {
        foo: { body: ["bar()"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "call",
                    value: "bar",
                },
            ],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("chained function call", () => {
    const data = {
        foo: { body: ["fizz().buzz()"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "call",
                    value: "fizz",
                    parent: {
                        type: "call",
                        value: "buzz",
                    },
                },
            ],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("method call", () => {
    const data = {
        foo: { body: ["obj.bar()"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "call",
                    value: "bar",
                    parent: {
                        type: "object",
                        value: "obj",
                    },
                },
            ],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("argument", () => {
    const data = {
        foo: { body: ["bar(arg1)"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "call",
                    value: "bar",
                    arguments: ["arg1"],
                },
            ],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("arguments", () => {
    const data = {
        foo: { body: ["bar(arg1, arg2)"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "call",
                    value: "bar",
                    arguments: ["arg1", "arg2"],
                },
            ],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty function name", () => {
    const data = {
        foo: { body: ["(arg2)"] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: function name in function call in 'foo' cannot be empty."
    );
});

test("empty argument", () => {
    const data = {
        foo: { body: ["bar(,arg2)"] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: argument in function call 'bar' in 'foo' cannot be empty."
    );
});
