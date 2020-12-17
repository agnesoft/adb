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
            describe("addition", () => {
                describe("valid", () => {
                    test("type += 1", () => {
                        const data = {
                            Id: "int64",
                            foo: {
                                body: ["Id += 1"],
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
                                        type: "addition",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                            realType: "int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "number",
                                            value: 1,
                                            realType: "int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });

                    test("array += value", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            foo: {
                                arguments: ["Id"],
                                body: ["MyArr += Id"],
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
                                arrayType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["Id"],
                                body: [
                                    {
                                        type: "addition",
                                        left: {
                                            type: "new",
                                            realType: "MyArr",
                                            astType: "array",
                                            value: "MyArr",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "Id",
                                            realType: "int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });

                    test("array += array", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            OtherArr: "MyArr",
                            foo: {
                                arguments: ["OtherArr"],
                                body: ["MyArr += OtherArr"],
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
                                arrayType: "int64",
                            },
                            OtherArr: {
                                type: "alias",
                                name: "OtherArr",
                                aliasedType: "MyArr",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["OtherArr"],
                                body: [
                                    {
                                        type: "addition",
                                        left: {
                                            type: "new",
                                            value: "MyArr",
                                            astType: "array",
                                            realType: "MyArr",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "OtherArr",
                                            realType: "MyArr",
                                            astType: "array",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });

                    test("local += argument", () => {
                        const data = {
                            Id: "int64",
                            ArgId: "Id",
                            foo: {
                                arguments: ["ArgId"],
                                body: ["Id = ArgId", "Id += 3"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            ArgId: {
                                type: "alias",
                                name: "ArgId",
                                aliasedType: "Id",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["ArgId"],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                            realType: "int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "ArgId",
                                            realType: "int64",
                                            astType: "native",
                                        },
                                    },
                                    {
                                        type: "addition",
                                        left: {
                                            type: "local",
                                            value: "Id",
                                            realType: "int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "number",
                                            value: 3,
                                            realType: "int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("array += <unknown value>", () => {
                        const data = {
                            MyArr: ["int64"],
                            foo: {
                                body: ["MyArr += Id"],
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext).toThrow(
                            "Analyzer: invalid expression in function 'foo'. Unknown type 'Id'."
                        );
                    });

                    test("array += <incompatible type>", () => {
                        const data = {
                            MyArr: ["int64"],
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["MyArr += SomeType"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: invalid expression in function 'foo'. Cannot add 'SomeType' (aka SomeType [object]) to 'MyArr' (aka MyArr [array])."
                        );
                    });

                    test("<non number> += number", () => {
                        const data = {
                            Id: "int64",
                            MyArr: ["int64"],
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["SomeType += 1"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: invalid expression in function 'foo'. Cannot add '1' (aka int64 [native]) to 'SomeType' (aka SomeType [object])."
                        );
                    });
                });
            });
        });
    });
});
