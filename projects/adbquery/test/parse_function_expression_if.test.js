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

describe("parse", () => {
    describe("function", () => {
        describe("expression", () => {
            describe("if", () => {
                describe("valid", () => {
                    test("equals", () => {
                        const data = {
                            foo: {
                                body: ["if (1 == 1) { bar() }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "number",
                                            value: 1,
                                        },
                                        comparator: "==",
                                        right: {
                                            type: "number",
                                            value: 1,
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bar",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("not equals", () => {
                        const data = {
                            foo: {
                                body: ["if (fizz(arg) != 3) { bar() }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "call",
                                            arguments: [
                                                {
                                                    type: "argument",
                                                    value: "arg",
                                                },
                                            ],
                                            value: "fizz",
                                        },
                                        comparator: "!=",
                                        right: {
                                            type: "number",
                                            value: 3,
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bar",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("less than", () => {
                        const data = {
                            foo: {
                                body: ["if (arg < 3) { arr += arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "type",
                                            value: "arg",
                                        },
                                        comparator: "<",
                                        right: {
                                            type: "number",
                                            value: 3,
                                        },
                                        body: [
                                            {
                                                type: "addition",
                                                left: {
                                                    type: "type",
                                                    value: "arr",
                                                },
                                                right: {
                                                    type: "type",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("less than or equals", () => {
                        const data = {
                            foo: {
                                body: ["if (arg <= 3) { arr += arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "type",
                                            value: "arg",
                                        },
                                        comparator: "<=",
                                        right: {
                                            type: "number",
                                            value: 3,
                                        },
                                        body: [
                                            {
                                                type: "addition",
                                                left: {
                                                    type: "type",
                                                    value: "arr",
                                                },
                                                right: {
                                                    type: "type",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("greater than", () => {
                        const data = {
                            foo: {
                                body: ["if (arg > 3) { var = arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "type",
                                            value: "arg",
                                        },
                                        comparator: ">",
                                        right: {
                                            type: "number",
                                            value: 3,
                                        },
                                        body: [
                                            {
                                                type: "assignment",
                                                left: {
                                                    type: "type",
                                                    value: "var",
                                                },
                                                right: {
                                                    type: "type",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("greater than or equals", () => {
                        const data = {
                            foo: {
                                body: ["if (arg >= 3) { var = arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "if",
                                        left: {
                                            type: "type",
                                            value: "arg",
                                        },
                                        comparator: ">=",
                                        right: {
                                            type: "number",
                                            value: 3,
                                        },
                                        body: [
                                            {
                                                type: "assignment",
                                                left: {
                                                    type: "type",
                                                    value: "var",
                                                },
                                                right: {
                                                    type: "type",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("missing whitespace after if", () => {
                        const data = {
                            foo: {
                                body: ["if(1 == 1) { bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: type name in expression in function 'foo' cannot be empty."
                        );
                    });

                    test("missing whitespace before body", () => {
                        const data = {
                            foo: {
                                body: ["if (1 == 1){ bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: invalid syntax in 'if/for' expression in function 'foo' (missing whitespace? I.e. 'if/for () {}')."
                        );
                    });

                    test("unknown comparator", () => {
                        const data = {
                            foo: {
                                body: ["if (1 IS 1) { bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: no valid if comparator found in function 'foo'."
                        );
                    });
                });
            });
        });
    });
});
