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
                            Id: "Int64",
                            foo: {
                                body: ["Id += 1"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "+=",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "number",
                                            value: 1,
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toMatchObject(ast);
                    });

                    test("array += value", () => {
                        const data = {
                            Id: "Int64",
                            MyArr: ["Int64"],
                            foo: {
                                arguments: ["Id"],
                                body: ["MyArr += Id"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "+=",
                                        left: {
                                            type: "new",
                                            realType: "MyArr",
                                            astType: "array",
                                            value: "MyArr",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "Id",
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toMatchObject(ast);
                    });

                    test("array += array", () => {
                        const data = {
                            Id: "Int64",
                            MyArr: ["Int64"],
                            OtherArr: "MyArr",
                            foo: {
                                arguments: ["OtherArr"],
                                body: ["MyArr += OtherArr"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "+=",
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
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toMatchObject(ast);
                    });

                    test("local = argument, local += argument", () => {
                        const data = {
                            Id: "Int64",
                            ArgId: "Id",
                            foo: {
                                arguments: ["ArgId"],
                                body: ["Id = ArgId", "Id += 3"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "=",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "argument",
                                            value: "ArgId",
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                    },
                                    {
                                        type: "+=",
                                        left: {
                                            type: "local",
                                            value: "Id",
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "number",
                                            value: 3,
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext()).toMatchObject(ast);
                    });
                });

                describe("invalid", () => {
                    test("array += <unknown value>", () => {
                        const data = {
                            MyArr: ["Int64"],
                            foo: {
                                body: ["MyArr += Id"],
                            },
                        };

                        const addContext = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(addContext).toThrow("Analyzer: invalid expression in function 'foo'. Unknown type 'Id'.");
                    });

                    test("array += <incompatible type>", () => {
                        const data = {
                            MyArr: ["Int64"],
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["MyArr += SomeType"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Cannot add 'SomeType' (aka SomeType [object]) to 'MyArr' (aka MyArr [array]).");
                    });

                    test("<non number> += number", () => {
                        const data = {
                            Id: "Int64",
                            MyArr: ["Int64"],
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["SomeType += 1"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Cannot add '1' (aka Int64 [native]) to 'SomeType' (aka SomeType [object]).");
                    });
                });
            });
        });
    });
});
