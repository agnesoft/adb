import * as parser from "../compiler/parser.js";

test("empty", () => {
    const data = {
        foo: { body: [] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("invalid body", () => {
    const data = {
        foo: { body: {} },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: type of 'body' of 'foo' invalid ('object', must be 'array')."
    );
});

test("empty expression", () => {
    const data = {
        foo: { body: [""] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: expression in 'body' of 'foo' cannot be empty."
    );
});

test("invalid expression", () => {
    const data = {
        foo: { body: [{}] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: expression in 'body' of 'foo' invalid ('object', must be 'string')."
    );
});

test("argument", () => {
    const data = {
        foo: { arguments: ["arg1"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: ["arg1"],
            body: [],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("arguments", () => {
    const data = {
        foo: { arguments: ["arg1", "arg2"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: ["arg1", "arg2"],
            body: [],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty argument", () => {
    const data = {
        foo: { arguments: [""] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: argument in 'arguments' of 'foo' cannot be empty."
    );
});

test("invalid argument", () => {
    const data = {
        foo: { arguments: [{}] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: argument in 'arguments' of 'foo' invalid ('object', must be 'string')."
    );
});

test("invalid arguments", () => {
    const data = {
        foo: { arguments: {} },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: type of 'arguments' of 'foo' invalid ('object', must be 'array')."
    );
});

test("return", () => {
    const data = {
        foo: { return: "Id" },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [],
            returnValue: "Id",
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty return", () => {
    const data = {
        foo: { return: "" },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow("Parser: 'return' of 'foo' cannot be empty.");
});

test("invalid return", () => {
    const data = {
        foo: { return: {} },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: type of 'return' of 'foo' invalid ('object', must be 'string')."
    );
});
