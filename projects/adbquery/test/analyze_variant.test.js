import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("variant", () => {
        describe("valid", () => {
            test("two", () => {
                const data = {
                    SomeType: {},
                    MyVariant: ["SomeType", "int64"],
                };

                const ast = {
                    SomeType: {
                        type: "object",
                        name: "SomeType",
                        functions: {},
                        fields: [],
                    },
                    MyVariant: {
                        type: "variant",
                        name: "MyVariant",
                        variants: ["SomeType", "int64"],
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });
        });

        describe("invalid", () => {
            test("unknown variant type", () => {
                const data = {
                    MyVariant: ["int64", "SomeType"],
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze).toThrow(
                    "Analyzer: unknown type 'SomeType' used as a variant of 'MyVariant'."
                );
            });
        });
    });
});
