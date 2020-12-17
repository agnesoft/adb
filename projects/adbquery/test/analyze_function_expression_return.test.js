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
                            Id: "int64",
                            foo: {
                                body: ["return 1"],
                                return: "Id",
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: 1,
                                        astType: "native",
                                        realType: "int64",
                                        returnType: "number",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("new custom", () => {
                        const data = {
                            Id: "int64",
                            Obj: { fields: ["Id"] },
                            foo: {
                                arguments: ["Id"],
                                body: ["return Obj(Id)"],
                                return: "Obj",
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            Obj: {
                                type: "object",
                                name: "Obj",
                                fields: ["Id"],
                                functions: {},
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["Id"],
                                body: [
                                    {
                                        type: "return",
                                        arguments: [
                                            {
                                                type: "argument",
                                                astType: "native",
                                                realType: "int64",
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

                        expect(analyze()).toEqual(ast);
                    });

                    test("field", () => {
                        const data = {
                            Id: "int64",
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
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                fields: ["Id"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "Id",
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                realType: "int64",
                                                astType: "native",
                                                returnType: "field",
                                            },
                                        ],
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("field of field", () => {
                        const data = {
                            Id: "int64",
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
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            SubObj: {
                                type: "object",
                                name: "SubObj",
                                base: undefined,
                                fields: ["Id"],
                                functions: {},
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                base: undefined,
                                fields: ["SubObj"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "Id",
                                        body: [
                                            {
                                                type: "return",
                                                value: "Id",
                                                realType: "int64",
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
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("variant of field", () => {
                        const data = {
                            Id: "int64",
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
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            MyArr: {
                                type: "array",
                                name: "MyArr",
                                arrayType: "Id",
                            },
                            MyVar: {
                                type: "variant",
                                name: "MyVar",
                                variants: ["Id", "MyArr"],
                            },
                            MyObj: {
                                type: "object",
                                name: "MyObj",
                                base: undefined,
                                fields: ["MyVar"],
                                functions: {
                                    foo: {
                                        type: "function",
                                        name: "foo",
                                        arguments: [],
                                        returnValue: "MyArr",
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
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
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
                            `Analyzer: invalid expression in function 'foo'. Cannot assign '1' (aka int64 [native]) to 'Obj' (aka Obj [object]).`
                        );
                    });
                });
            });
        });
    });
});
