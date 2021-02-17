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
            describe("call", () => {
                describe("valid", () => {
                    test("single", () => {
                        const data = {
                            foo: { body: ["bar()"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("chained", () => {
                        const data = {
                            foo: { body: ["fizz().buzz()"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "buzz",
                                        arguments: [],
                                        parent: {
                                            type: "call",
                                            arguments: [],
                                            value: "fizz",
                                        },
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("method", () => {
                        const data = {
                            foo: { body: ["obj.bar()"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [],
                                        parent: {
                                            type: "identifier",
                                            value: "obj",
                                        },
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("with argument", () => {
                        const data = {
                            foo: { body: ["bar(arg1)"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "identifier",
                                                value: "arg1",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("with arguments", () => {
                        const data = {
                            foo: { body: ["bar(arg1, arg2)"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "identifier",
                                                value: "arg1",
                                            },
                                            {
                                                type: "identifier",
                                                value: "arg2",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("nested call", () => {
                        const data = {
                            foo: { body: ["foo(1, bar())"] },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "call",
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 1,
                                            },
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

                    test("nested call with parameters", () => {
                        const data = {
                            foo: { body: ["foo(1, bar(2, 3))"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 1,
                                            },
                                            {
                                                type: "call",
                                                value: "bar",
                                                arguments: [
                                                    {
                                                        type: "number",
                                                        value: 2,
                                                    },
                                                    {
                                                        type: "number",
                                                        value: 3,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toMatchObject(ast);
                    });

                    test("method call as argument", () => {
                        const data = {
                            foo: { body: ["foo(1, obj.bar())"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "number",
                                                value: 1,
                                            },
                                            {
                                                type: "call",
                                                value: "bar",
                                                arguments: [],
                                                parent: {
                                                    type: "identifier",
                                                    value: "obj",
                                                },
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
                    test("empty function name", () => {
                        const data = {
                            foo: { body: ["(arg2)"] },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: invalid expression in function 'foo' when parsing expression '(arg2)'."
                        );
                    });

                    test("missing end bracket", () => {
                        const data = {
                            foo: { body: ["foo(arg"] },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: unexpected end of data, expected an identifier or ')' in function 'foo' when parsing expression 'foo(arg'."
                        );
                    });
                });
            });
        });
    });
});
