import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("variant", () => {
        describe("valid", () => {
            test("two", () => {
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

            test("three", () => {
                const data = {
                    Operator: ["And", "Or", "Where"],
                };

                const ast = {
                    Operator: {
                        type: "variant",
                        name: "Operator",
                        variants: ["And", "Or", "Where"],
                    },
                };

                expect(parser.parse(data)).toEqual(ast);
            });
        });

        describe("invalid", () => {
            test("empty array as variants", () => {
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

            test("empty string as variant", () => {
                const data = {
                    MyVar: ["Id", ""],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: variant of 'MyVar' cannot be empty."
                );
            });

            test("object as variant", () => {
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
        });
    });
});
