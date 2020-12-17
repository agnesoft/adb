import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("invalid", () => {
                test("unknown expression type", () => {
                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: [],
                            returnValue: undefined,
                            body: [
                                {
                                    type: "unknown_type",
                                },
                            ],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(ast);
                    };

                    expect(analyze).toThrow(
                        "Analyzer: invalid expression in function 'foo'. Unknown expression type 'unknown_type'."
                    );
                });

                test("incorrect expression part", () => {
                    const data = {
                        Id: "int64",
                        MyVar: ["int64", "byte"],
                        foo: {
                            arguments: ["MyVar"],
                            body: ["MyVar.Id = 1"],
                        },
                    };

                    const analyze = () => {
                        analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(
                        `Analyzer: invalid expression in function 'foo'. Invalid parent 'MyVar' (aka MyVar [variant]) of 'Id' (aka int64 [native]).`
                    );
                });
            });
        });
    });
});
