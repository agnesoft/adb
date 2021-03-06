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
            describe("call", () => {
                describe("valid", () => {
                    test("free function", () => {
                        const data = {
                            foo: {
                                body: [],
                            },
                            bar: {
                                body: ["foo()"],
                            },
                        };

                        const ast = {
                            bar: {
                                body: [
                                    {
                                        type: "call",
                                        value: "foo",
                                        arguments: [],
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("free function with argument", () => {
                        const data = {
                            Id: "Int64",
                            foo: {
                                arguments: ["Int64"],
                                body: [],
                            },
                            bar: {
                                body: ["foo(1)"],
                            },
                        };

                        const ast = {
                            bar: {
                                body: [
                                    {
                                        type: "call",
                                        realType: undefined,
                                        astType: undefined,
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 1,
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("method", () => {
                        const data = {
                            SomeObj: {
                                functions: {
                                    foo: {
                                        body: [],
                                    },
                                    bar: {
                                        body: ["foo()"],
                                    },
                                },
                            },
                        };

                        const ast = {
                            SomeObj: {
                                functions: {
                                    bar: {
                                        body: [
                                            {
                                                type: "method",
                                                value: "foo",
                                                arguments: [],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                },
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("argument's method", () => {
                        const data = {
                            SomeObj: {
                                functions: {
                                    foo: {
                                        body: [],
                                    },
                                },
                            },
                            bar: {
                                arguments: ["SomeObj"],
                                body: ["SomeObj.foo()"],
                            },
                        };

                        const ast = {
                            bar: {
                                body: [
                                    {
                                        type: "method",
                                        value: "foo",
                                        astType: undefined,
                                        realType: undefined,
                                        arguments: [],
                                        parent: {
                                            type: "argument",
                                            value: "SomeObj",
                                            astType: "object",
                                            realType: "SomeObj",
                                        },
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("constructor", () => {
                        const data = {
                            Id: "Int64",
                            Obj: { fields: ["Id"] },
                            foo: {
                                arguments: ["Id"],
                                body: ["Obj(Id)"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "constructor",
                                        realType: "Obj",
                                        astType: "object",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "Id",
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                        ],
                                        value: "Obj",
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("<array>.size()", () => {
                        const data = {
                            IntAr: ["Int64"],
                            foo: {
                                arguments: ["IntAr"],
                                body: ["return IntAr.size()"],
                                return: "Int64",
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "return",
                                        realType: "Int64",
                                        astType: "native",
                                        arguments: [],
                                        value: "size",
                                        returnType: "method",
                                        parent: {
                                            type: "argument",
                                            value: "IntAr",
                                            realType: "IntAr",
                                            astType: "array",
                                        },
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("<array>.at(index)", () => {
                        const data = {
                            IntAr: ["Int64"],
                            foo: {
                                arguments: ["IntAr"],
                                body: ["return IntAr.at(3)"],
                                return: "Int64",
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "return",
                                        realType: "Int64",
                                        astType: "native",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 3,
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                        ],
                                        value: "at",
                                        returnType: "method",
                                        parent: {
                                            type: "argument",
                                            value: "IntAr",
                                            realType: "IntAr",
                                            astType: "array",
                                        },
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("<variant>.index()", () => {
                        const data = {
                            MyVar: ["Byte", "Int64"],
                            foo: {
                                arguments: ["MyVar"],
                                body: ["return MyVar.index()"],
                                return: "Byte",
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "return",
                                        returnType: "method",
                                        value: "index",
                                        realType: "Byte",
                                        astType: "native",
                                        arguments: [],
                                        parent: {
                                            type: "argument",
                                            value: "MyVar",
                                            realType: "MyVar",
                                            astType: "variant",
                                        },
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("nested call", () => {
                        const data = {
                            bar: { body: ["return 1"], return: "Int64" },
                            foo: { arguments: ["Int64"], body: ["foo(bar())"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        arguments: [
                                            {
                                                type: "call",
                                                arguments: [],
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                        ],
                                        value: "foo",
                                        realType: undefined,
                                        astType: undefined,
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("nested call with parameters", () => {
                        const data = {
                            bar: {
                                arguments: ["Int64", "Double"],
                                body: ["return 1"],
                                return: "Int64",
                            },
                            foo: {
                                arguments: ["Double", "Int64"],
                                body: ["foo(1, bar(2, 3))"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 1,
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                            {
                                                type: "call",
                                                arguments: [
                                                    {
                                                        type: "number",
                                                        value: 2,
                                                        realType: "Int64",
                                                        astType: "native",
                                                    },
                                                    {
                                                        type: "number",
                                                        value: 3,
                                                        realType: "Int64",
                                                        astType: "native",
                                                    },
                                                ],
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                        ],
                                        value: "foo",
                                        realType: undefined,
                                        astType: undefined,
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("method call", () => {
                        const data = {
                            MyArr: ["Int64"],
                            bar: {
                                arguments: ["Int64", "Double"],
                                body: ["return 1"],
                                return: "Int64",
                            },
                            foo: {
                                arguments: ["Double", "Int64", "MyArr"],
                                body: ["bar(1, bar(2, MyArr.size()))"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 1,
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                            {
                                                type: "call",
                                                arguments: [
                                                    {
                                                        type: "number",
                                                        value: 2,
                                                        realType: "Int64",
                                                        astType: "native",
                                                    },
                                                    {
                                                        type: "method",
                                                        value: "size",
                                                        arguments: [],
                                                        realType: "Int64",
                                                        astType: "native",
                                                        parent: {
                                                            type: "argument",
                                                            value: "MyArr",
                                                            realType: "MyArr",
                                                            astType: "array",
                                                        },
                                                    },
                                                ],
                                                realType: "Int64",
                                                astType: "native",
                                            },
                                        ],
                                        realType: "Int64",
                                        astType: "native",
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("used before defined", () => {
                        const data = {
                            foo: {
                                body: ["bar()"],
                            },
                            bar: { body: [] },
                        };

                        const ast = {
                            bar: {
                                usedBeforeDefined: true,
                            },
                        };

                        const result = analyzer.analyze(parser.parse(data));

                        expect(result).toMatchObject(ast);
                        expect("usedBeforeDefined" in result["foo"]).toBeFalsy();
                    });
                });

                describe("invalid", () => {
                    test("incorrect argument", () => {
                        const data = {
                            Id: "Int64",
                            Obj: {},
                            foo: {
                                arguments: ["Obj"],
                            },
                            bar: {
                                arguments: ["Id"],
                                body: ["foo(Id)"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'bar'. Cannot assign 'Id' (aka Int64 [native]) to 'Obj' (aka Obj [object]).");
                    });

                    test("non-function type", () => {
                        const data = {
                            Arr: ["Int64"],
                            foo: {
                                body: ["Arr()"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Cannot call 'Arr' (not a function).");
                    });

                    test("non-existent method", () => {
                        const data = {
                            SomeObj: {},
                            foo: {
                                arguments: ["SomeObj"],
                                body: ["SomeObj.bar()"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Cannot call 'bar' on 'SomeObj' (aka SomeObj [object]).");
                    });

                    test("too few arguments", () => {
                        const data = {
                            Id: "Int64",
                            FromId: "Id",
                            foo: {
                                arguments: ["Id", "FromId"],
                            },
                            bar: {
                                body: ["foo(1)"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'bar'. Incorrect number of arguments in call to 'foo' (expected 2, got 1).");
                    });

                    test("too many arguments", () => {
                        const data = {
                            Id: "Int64",
                            foo: {
                                arguments: ["Id"],
                            },
                            bar: {
                                body: ["foo(1, 3)"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'bar'. Incorrect number of arguments in call to 'foo' (expected 1, got 2).");
                    });
                });
            });
        });
    });
});
