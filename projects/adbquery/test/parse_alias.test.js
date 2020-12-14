import * as parser from "../compiler/parser.js";

describe("parse", () => {
    describe("alias", () => {
        describe("valid", () => {
            test("native", () => {
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
        });

        describe("invalid", () => {
            test("empty string as aliased type", () => {
                const data = {
                    Id: "",
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: type of alias 'Id' cannot be empty."
                );
            });
        });
    });
});
