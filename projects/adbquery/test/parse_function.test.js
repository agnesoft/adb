import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("function", () => {
        describe("valid", () => {
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
        });

        describe("invalid", () => {
            test("array as body", () => {
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
        });
    });
});
