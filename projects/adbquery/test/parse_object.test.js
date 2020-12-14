import * as parser from "../compiler/parser.js";

describe("parse", () => {
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
                        fields: [],
                        functions: {},
                    },
                };

                expect(parser.parse(data)).toEqual(ast);
            });
        });
    });
});
