import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("object", () => {
        describe("valid", () => {
            test("empty", () => {
                const data = {
                    MyObj: {},
                };

                const ast = {
                    MyObj: {
                        type: "object",
                        name: "MyObj",
                        functions: {},
                        fields: [],
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
