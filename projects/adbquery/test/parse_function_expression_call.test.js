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
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        arguments: [],
                                        value: "bar",
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("chained", () => {
                        const data = {
                            foo: { body: ["fizz().buzz()"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        arguments: [],
                                        value: "buzz",
                                        parent: {
                                            type: "call",
                                            arguments: [],
                                            value: "fizz",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("method", () => {
                        const data = {
                            foo: { body: ["obj.bar()"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        arguments: [],
                                        value: "bar",
                                        parent: {
                                            type: "type",
                                            value: "obj",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("with argument", () => {
                        const data = {
                            foo: { body: ["bar(arg1)"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "arg1",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("with arguments", () => {
                        const data = {
                            foo: { body: ["bar(arg1, arg2)"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "call",
                                        value: "bar",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "arg1",
                                            },
                                            {
                                                type: "argument",
                                                value: "arg2",
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("nested call", () => {
                        const data = {
                            bar: { body: [] },
                            foo: { body: ["foo(1, bar())"] },
                        };

                        const ast = {
                            bar: {
                                type: "function",
                                name: "bar",
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
                                        type: "call",
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "1",
                                            },
                                            {
                                                type: "call",
                                                arguments: [],
                                                value: "bar",
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("nested call with parameters", () => {
                        const data = {
                            bar: { body: [] },
                            foo: { body: ["foo(1, bar(2, 3))"] },
                        };

                        const ast = {
                            bar: {
                                type: "function",
                                name: "bar",
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
                                        type: "call",
                                        value: "foo",
                                        arguments: [
                                            {
                                                type: "argument",
                                                value: "1",
                                            },
                                            {
                                                type: "call",
                                                arguments: [
                                                    {
                                                        type: "argument",
                                                        value: "2",
                                                    },
                                                    {
                                                        type: "argument",
                                                        value: "3",
                                                    },
                                                ],
                                                value: "bar",
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
                    test("empty function name", () => {
                        const data = {
                            foo: { body: ["(arg2)"] },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: function name in function call in 'foo' cannot be empty."
                        );
                    });
                });
            });
        });
    });
});
