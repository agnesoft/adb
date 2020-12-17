import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("object", () => {
        describe("fields", () => {
            describe("valid", () => {
                test("multiple", () => {
                    const data = {
                        Id: "int64",
                        Ids: ["Id"],
                        MyObj: {
                            fields: ["Id", "Ids"],
                        },
                    };

                    const ast = {
                        Id: {
                            type: "alias",
                            name: "Id",
                            aliasedType: "int64",
                        },
                        Ids: {
                            type: "array",
                            name: "Ids",
                            arrayType: "Id",
                        },
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            functions: {},
                            fields: ["Id", "Ids"],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze()).toEqual(ast);
                });
            });

            describe("invalid", () => {
                test("unknown field type", () => {
                    const data = {
                        Id: "int64",
                        MyObj: {
                            fields: ["Id", "Ids"],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(
                        "Analyzer: the field 'Ids' of object 'MyObj' is not an existing type."
                    );
                });
            });
        });
    });
});
