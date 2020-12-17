import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("return", () => {
            describe("invalid", () => {
                test("unknown return type", () => {
                    const data = {
                        foo: {
                            return: "Id",
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(
                        `Analyzer: the return type 'Id' of function 'foo' is not an existing type.`
                    );
                });

                test("missing return statement", () => {
                    const data = {
                        Id: "int64",
                        foo: {
                            return: "Id",
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(
                        "Analyzer: missing return statement in function 'foo' that has a return value."
                    );
                });
            });
        });
    });
});
