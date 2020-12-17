import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("array", () => {
        describe("valid", () => {
            test("native type", () => {
                const data = {
                    MyArr: ["int64"],
                };

                const ast = {
                    MyArr: {
                        type: "array",
                        name: "MyArr",
                        arrayType: "int64",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });

            test("custom type", () => {
                const data = {
                    SomeObj: {},
                    MyArr: ["SomeObj"],
                };

                const ast = {
                    SomeObj: {
                        type: "object",
                        name: "SomeObj",
                        functions: {},
                        fields: [],
                    },
                    MyArr: {
                        type: "array",
                        name: "MyArr",
                        arrayType: "SomeObj",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });
        });

        describe("invalid", () => {
            test("unknown type", () => {
                const data = {
                    MyArr: ["SomeType"],
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze).toThrow(
                    "Analyzer: unknown type 'SomeType' used as an array type of 'MyArr'."
                );
            });
        });
    });
});
