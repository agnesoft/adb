import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    test("unknown type", () => {
        const ast = {
            MyType: {
                type: "NewType",
                name: "MyType",
            },
        };

        const analyze = () => {
            return analyzer.analyze(ast);
        };

        expect(analyze).toThrow(
            "Analyzer: unknown type 'NewType' named 'MyType'."
        );
    });
});
