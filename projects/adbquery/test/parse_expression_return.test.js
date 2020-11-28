import * as parser from "../compiler/parser.js";

test("type", () => {
    const data = {
        foo: {
            body: ["return Id"],
            return: "Id",
        },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "return",
                    value: "Id",
                    returnType: "type",
                },
            ],
            returnValue: "Id",
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("nested type", () => {
    const data = {
        foo: {
            body: ["return MyObj.Id"],
            return: "Id",
        },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "return",
                    value: "Id",
                    returnType: "type",
                    parent: {
                        type: "type",
                        value: "MyObj",
                    },
                },
            ],
            returnValue: "Id",
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty type", () => {
    const data = {
        foo: { body: ["return "], return: "Id" },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: return type in expression in function 'foo' cannot be empty."
    );
});
