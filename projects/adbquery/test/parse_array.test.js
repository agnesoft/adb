import * as parser from "../compiler/parser.js";

test("valid", () => {
    const data = {
        String: ["byte"],
    };

    const ast = {
        String: {
            type: "array",
            name: "String",
            arrayType: "byte",
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty string", () => {
    const data = {
        MyArr: [""],
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow("Parser: type of array 'MyArr' cannot be empty.");
});

test("invalid array", () => {
    const data = {
        MyArr: [{}],
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: type of array 'MyArr' invalid ('object', must be 'string')."
    );
});
