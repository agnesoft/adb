// Copyright 2020 Agnesoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as parser from "../compiler/parser.js";
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("return", () => {
                describe("valid", () => {
                    test("new native", () => {
                        const data = {
                            Id: "Int64",
                            foo: {
                                body: ["return 1"],
                                return: "Id",
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "return",
                                        value: 1,
                                        astType: "native",
                                        realType: "Int64",
                                        returnType: "number",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("new custom", () => {
                        const data = {
                            Id: "Int64",
                            Obj: { fields: ["Id"] },
                            foo: {
                                arguments: ["Id"],
                                body: ["return Obj(Id)"],
                                return: "Obj",
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "return",
                                        arguments: [
                                            {
                                                type: "argument",
                                                astType: "native",
                                                realType: "Int64",
                                                value: "Id",
                                            },
                                        ],
                                        value: "Obj",
                                        realType: "Obj",
                                        astType: "object",
                                        returnType: "constructor",
                                    },
                                ],
                                returnValue: "Obj",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("field", () => {
                        const data = {
                            Id: "Int64",
                            MyObj: {
                                fields: ["Id"],
                                functions: {
                                    foo: {
                                        body: ["return Id"],
                                        return: "Id",
                                    },
                                },
                            },
                        };

                        const ast = {
                            MyObj: {
                                functions: {
                                    foo: {
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                realType: "Int64",
                                                astType: "native",
                                                returnType: "field",
                                            },
                                        ],
                                        returnValue: "Id",
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("field of field", () => {
                        const data = {
                            Id: "Int64",
                            SubObj: {
                                fields: ["Id"],
                            },
                            MyObj: {
                                fields: ["SubObj"],
                                functions: {
                                    foo: {
                                        body: ["return SubObj.Id"],
                                        return: "Id",
                                    },
                                },
                            },
                        };

                        const ast = {
                            MyObj: {
                                functions: {
                                    foo: {
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                realType: "Int64",
                                                astType: "native",
                                                returnType: "field",
                                                parent: {
                                                    type: "field",
                                                    realType: "SubObj",
                                                    astType: "object",
                                                    value: "SubObj",
                                                },
                                            },
                                        ],
                                        returnValue: "Id",
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("variant of field", () => {
                        const data = {
                            Id: "Int64",
                            MyArr: ["Id"],
                            MyVar: ["Id", "MyArr"],
                            MyObj: {
                                fields: ["MyVar"],
                                functions: {
                                    foo: {
                                        body: ["return MyVar.MyArr"],
                                        return: "MyArr",
                                    },
                                },
                            },
                        };

                        const ast = {
                            MyObj: {
                                functions: {
                                    foo: {
                                        body: [
                                            {
                                                type: "return",
                                                value: "MyArr",
                                                realType: "MyArr",
                                                astType: "array",
                                                returnType: "variant",
                                                parent: {
                                                    type: "field",
                                                    value: "MyVar",
                                                    realType: "MyVar",
                                                    astType: "variant",
                                                },
                                            },
                                        ],
                                        returnValue: "MyArr",
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });
                });

                describe("invalid", () => {
                    test("not matching return type", () => {
                        const data = {
                            Obj: {},
                            foo: {
                                body: ["return 1"],
                                return: "Obj",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            `Analyzer: invalid expression in function 'foo'. Cannot assign '1' (aka Int64 [native]) to 'Obj' (aka Obj [object]).`
                        );
                    });
                });
            });
        });
    });
});
