import * as parser from "../compiler/parser.js";

test("valid", () => {
    const data = {
        Size: "int64",
    };

    const ast = {
        Size: {
            type: "alias",
            name: "Size",
            aliasedType: "int64",
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty string", () => {
    const data = {
        Id: "",
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow("Parser: type of alias 'Id' cannot be empty.");
});
