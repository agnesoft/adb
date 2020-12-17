import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("arguments", () => {
            describe("valid", () => {
                test("multiple", () => {
                    const data = {
                        Id: "int64",
                        From: "Id",
                        foo: {
                            arguments: ["Id", "From"],
                        },
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
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: ["Id", "From"],
                            body: [],
                            returnValue: undefined,
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze()).toEqual(ast);
                });
            });

            describe("invalid", () => {
                test("unknown argument type", () => {
                    const data = {
                        Id: "int64",
                        foo: {
                            arguments: ["Id", "From"],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(
                        `Analyzer: the argument 'From' in function 'foo' is not an existing type.`
                    );
                });
            });
        });
    });
});
