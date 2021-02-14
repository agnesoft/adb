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
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "number",
                                                value: 1,
                                            },
                                            type: "==",
                                            right: {
                                                type: "number",
                                                value: 1,
                                            },
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
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("not equals", () => {
                        const data = {
                            foo: {
                                body: ["if (fizz(arg) != 3) { bar() }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "call",
                                                arguments: [
                                                    {
                                                        type: "identifier",
                                                        value: "arg",
                                                    },
                                                ],
                                                value: "fizz",
                                            },
                                            type: "!=",
                                            right: {
                                                type: "number",
                                                value: 3,
                                            },
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
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("less than", () => {
                        const data = {
                            foo: {
                                body: ["if (arg < 3) { arr += arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "arg",
                                            },
                                            type: "<",
                                            right: {
                                                type: "number",
                                                value: 3,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "+=",
                                                left: {
                                                    type: "identifier",
                                                    value: "arr",
                                                },
                                                right: {
                                                    type: "identifier",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("less than or equals", () => {
                        const data = {
                            foo: {
                                body: ["if (arg <= 3) { arr += arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "arg",
                                            },
                                            type: "<=",
                                            right: {
                                                type: "number",
                                                value: 3,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "+=",
                                                left: {
                                                    type: "identifier",
                                                    value: "arr",
                                                },
                                                right: {
                                                    type: "identifier",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("greater than", () => {
                        const data = {
                            foo: {
                                body: ["if (arg > 3) { var = arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "arg",
                                            },
                                            type: ">",
                                            right: {
                                                type: "number",
                                                value: 3,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "=",
                                                left: {
                                                    type: "identifier",
                                                    value: "var",
                                                },
                                                right: {
                                                    type: "identifier",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("greater than or equals", () => {
                        const data = {
                            foo: {
                                body: ["if (arg >= 3) { var = arg }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "arg",
                                            },
                                            type: ">=",
                                            right: {
                                                type: "number",
                                                value: 3,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "=",
                                                left: {
                                                    type: "identifier",
                                                    value: "var",
                                                },
                                                right: {
                                                    type: "identifier",
                                                    value: "arg",
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("else", () => {
                        const data = {
                            foo: {
                                body: [
                                    "if (1 == 1) { fizz() }",
                                    "else { bazz() }",
                                ],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "number",
                                                value: 1,
                                            },
                                            type: "==",
                                            right: {
                                                type: "number",
                                                value: 1,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "fizz",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                    {
                                        type: "else",
                                        body: [
                                            {
                                                type: "call",
                                                value: "bazz",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("else if", () => {
                        const data = {
                            foo: {
                                body: [
                                    "if (Arg == 1) { fizz() }",
                                    "else if (Arg == 2) { bazz() }",
                                ],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "Arg",
                                            },
                                            type: "==",
                                            right: {
                                                type: "number",
                                                value: 1,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "fizz",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                    {
                                        type: "elseif",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "Arg",
                                            },
                                            type: "==",
                                            right: {
                                                type: "number",
                                                value: 2,
                                            },
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bazz",
                                                arguments: [],
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("with return", () => {
                        const data = {
                            foo: { body: ["if (Float < Id) { return 1 }"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "if",
                                        condition: {
                                            left: {
                                                type: "identifier",
                                                value: "Float",
                                            },
                                            type: "<",
                                            right: {
                                                type: "identifier",
                                                value: "Id",
                                            },
                                        },
                                        body: [
                                            {
                                                type: "return",
                                                value: 1,
                                                returnType: "number",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });
                });

                describe("invalid", () => {
                    test("unknown comparator", () => {
                        const data = {
                            foo: {
                                body: ["if (1 IS 2) { bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: expected '(' or '.' or an operator, got 'IS' [identifier] in function 'foo' when parsing expression 'if (1 IS 2) { bar() }'."
                        );
                    });
                });
            });
        });
    });
});
