import * as parser from "../compiler/parser.js";

test("valid", () => {
    const data = {
        Operator: ["And", "Or"],
    };

    const ast = {
        Operator: {
            type: "variant",
            name: "Operator",
            variants: ["And", "Or"],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty array", () => {
    const data = {
        MyVar: [],
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: list of variants of 'MyVar' cannot be empty."
    );
});

test("empty string", () => {
    const data = {
        MyVar: ["Id", ""],
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow("Parser: variant of 'MyVar' cannot be empty.");
});

test("invalid variant type", () => {
    const data = {
        MyVar: ["Id", {}],
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: variant of 'MyVar' invalid ('object', must be 'string')."
    );
});
