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
            describe("if", () => {
                describe("valid", () => {
                    test("equals", () => {
                        const data = {
                            Arg: "int64",
                            bar: { body: [] },
                            fizz: {
                                arguments: ["Arg"],
                                body: ["return Arg"],
                                return: "int64",
                            },
                            foo: {
                                arguments: ["Arg"],
                                body: ["if (fizz(Arg) != 3) { bar() }"],
                            },
                        };

                        const ast = {
                            Arg: {
                                type: "alias",
                                name: "Arg",
                                aliasedType: "int64",
                            },
                            bar: {
                                type: "function",
                                name: "bar",
                                arguments: [],
                                body: [],
                                returnValue: undefined,
                            },
                            fizz: {
                                type: "function",
                                name: "fizz",
                                arguments: ["Arg"],
                                body: [
                                    {
                                        type: "return",
                                        value: "Arg",
                                        astType: "native",
                                        realType: "int64",
                                        returnType: "argument",
                                    },
                                ],
                                returnValue: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["Arg"],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "call",
                                            astType: "native",
                                            realType: "int64",
                                            arguments: [
                                                {
                                                    type: "argument",
                                                    astType: "native",
                                                    realType: "int64",
                                                    value: "Arg",
                                                },
                                            ],
                                            value: "fizz",
                                        },
                                        comparator: "!=",
                                        right: {
                                            type: "number",
                                            astType: "native",
                                            realType: "int64",
                                            value: 3,
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                astType: undefined,
                                                realType: undefined,
                                                value: "bar",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("if/else", () => {
                        const data = {
                            fizz: { body: [] },
                            buzz: { body: [] },
                            foo: {
                                body: [
                                    "if (1 == 2) { fizz() }",
                                    "else { buzz() }",
                                ],
                            },
                        };

                        const ast = {
                            fizz: {
                                type: "function",
                                name: "fizz",
                                arguments: [],
                                body: [],
                                returnValue: undefined,
                            },
                            buzz: {
                                type: "function",
                                name: "buzz",
                                arguments: [],
                                body: [],
                                returnValue: undefined,
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "number",
                                            realType: "int64",
                                            astType: "native",
                                            value: 1,
                                        },
                                        right: {
                                            type: "number",
                                            realType: "int64",
                                            astType: "native",
                                            value: 2,
                                        },
                                        comparator: "==",
                                        body: [
                                            {
                                                type: "call",
                                                value: "fizz",
                                                arguments: [],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                    {
                                        type: "else",
                                        body: [
                                            {
                                                type: "call",
                                                value: "buzz",
                                                arguments: [],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("if/else if", () => {
                        const data = {
                            fizz: { body: [] },
                            buzz: { body: [] },
                            foo: {
                                body: [
                                    "if (1 == 2) { fizz() }",
                                    "else if (2 == 2) { buzz() }",
                                ],
                            },
                        };

                        const ast = {
                            fizz: {
                                type: "function",
                                name: "fizz",
                                arguments: [],
                                body: [],
                                returnValue: undefined,
                            },
                            buzz: {
                                type: "function",
                                name: "buzz",
                                arguments: [],
                                body: [],
                                returnValue: undefined,
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "number",
                                            realType: "int64",
                                            astType: "native",
                                            value: 1,
                                        },
                                        right: {
                                            type: "number",
                                            realType: "int64",
                                            astType: "native",
                                            value: 2,
                                        },
                                        comparator: "==",
                                        body: [
                                            {
                                                type: "call",
                                                value: "fizz",
                                                arguments: [],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                    {
                                        type: "elseif",
                                        left: {
                                            type: "number",
                                            realType: "int64",
                                            astType: "native",
                                            value: 2,
                                        },
                                        right: {
                                            type: "number",
                                            realType: "int64",
                                            astType: "native",
                                            value: 2,
                                        },
                                        comparator: "==",
                                        body: [
                                            {
                                                type: "call",
                                                value: "buzz",
                                                arguments: [],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("different comparison types", () => {
                        const data = {
                            Float: "double",
                            Id: "int64",
                            foo: {
                                arguments: ["Float", "Id"],
                                body: [
                                    "if (Float < Id) { return 1 }",
                                    "return 0",
                                ],
                                return: "int64",
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            `Analyzer: invalid expression in function 'foo'. Cannot compare 'Float' (aka double [native]) and 'Id' (aka int64 [native]).`
                        );
                    });

                    test("else without if", () => {
                        const data = {
                            foo: {
                                body: ["else { foo() }"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            `Analyzer: invalid expression in function 'foo'. The 'else/if' must follow 'if' or 'else if'.`
                        );
                    });

                    test("else if without if", () => {
                        const data = {
                            foo: {
                                body: ["else if (1 == 1) { foo() }"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            `Analyzer: invalid expression in function 'foo'. The 'else/if' must follow 'if' or 'else if'.`
                        );
                    });
                });
            });
        });
    });
});
