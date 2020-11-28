import * as parser from "../compiler/parser.js";

test("multiple", () => {
    const data = {
        foo: { body: ["Obj.Id = MyArr.int64", "MyVar.Obj.Field1 += 1"] },
    };

    const ast = {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: [
                {
                    type: "assignment",
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
                        value: "int64",
                        parent: {
                            type: "type",
                            value: "MyArr",
                        },
                    },
                },
                {
                    type: "addition",
                    left: {
                        type: "type",
                        value: "Field1",
                        parent: {
                            type: "type",
                            value: "Obj",
                            parent: {
                                type: "type",
                                value: "MyVar",
                            },
                        },
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

test("unknown expression", () => {
    const data = {
        foo: { body: ["SomeType * 2"] },
    };

    const parse = () => {
        parser.parse(data);
    };

    expect(parse).toThrow(
        "Parser: unknown expression 'SomeType * 2' in 'foo'."
    );
});
