import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
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
                        returnValue: undefined,
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });
        });
    });
});
