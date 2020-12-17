import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("alias", () => {
        describe("valid", () => {
            test("native type", () => {
                const data = {
                    Id: "int64",
                };

                const ast = {
                    Id: {
                        type: "alias",
                        name: "Id",
                        aliasedType: "int64",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });

            test("custom type", () => {
                const data = {
                    SomeType: {},
                    Id: "SomeType",
                };

                const ast = {
                    SomeType: {
                        type: "object",
                        name: "SomeType",
                        functions: {},
                        fields: [],
                    },
                    Id: {
                        type: "alias",
                        name: "Id",
                        aliasedType: "SomeType",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });

            test("alias of alias", () => {
                const data = {
                    Id: "int64",
                    From: "Id",
                };

                const ast = {
                    Id: {
                        type: "alias",
                        name: "Id",
                        aliasedType: "int64",
                    },
                    From: {
                        type: "alias",
                        name: "From",
                        aliasedType: "Id",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });
        });

        describe("invalid", () => {
            test("unknown alias type", () => {
                const data = {
                    Id: "SomeType",
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze).toThrow(
                    "Analyzer: unknown type 'SomeType' aliased as 'Id'."
                );
            });
        });
    });
});
