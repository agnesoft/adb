import * as parser from "../compiler/parser.js";

test("type += number", () => {
    const data = {
        foo: { body: ["Id += 1"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "addition",
                    left: {
                        type: "type",
                        value: "Id",
                    },
                    right: {
                        type: "number",
                        value: 1,
                    },
                },
            ],
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("type += type", () => {
    const data = {
        foo: { body: ["Id += From"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "addition",
                    left: {
                        type: "type",
                        value: "Id",
                    },
                    right: {
                        type: "type",
                        value: "From",
                    },
                },
            ],
            returnValue: undefined,
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("type.type += type.type", () => {
    const data = {
        foo: { body: ["Obj.Id += Arg1.From"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "addition",
                    left: {
                        type: "type",
                        value: "Id",
                        parent: {
                            type: "type",
                            value: "Obj",
                        },
                    },
                    right: {
                        type: "type",
                        value: "From",
                        parent: {
                            type: "type",
                            value: "Arg1",
                        },
                    },
                },
            ],
            returnValue: undefined,
        },
    };

    expect(parser.parse(data)).toEqual(ast);
});

test("empty type", () => {
    const data = {
        foo: { body: ["Obj. += Arg1.From"] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: type name in expression in function 'foo' cannot be empty."
    );
});
