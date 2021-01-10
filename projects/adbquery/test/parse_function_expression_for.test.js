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
            describe("for", () => {
                describe("valid", () => {
                    test("literal value", () => {
                        const data = {
                            foo: {
                                body: ["for (5) { bar(i) }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "for",
                                        iterations: {
                                            type: "number",
                                            value: 5,
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bar",
                                                arguments: [
                                                    {
                                                        type: "argument",
                                                        value: "i",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("function call", () => {
                        const data = {
                            foo: {
                                body: ["for (fizz(arg)) { bazz(i) }"],
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "for",
                                        iterations: {
                                            type: "call",
                                            arguments: [
                                                {
                                                    type: "argument",
                                                    value: "arg",
                                                },
                                            ],
                                            value: "fizz",
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bazz",
                                                arguments: [
                                                    {
                                                        type: "argument",
                                                        value: "i",
                                                    },
                                                ],
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
                    test("missing whitespace after for", () => {
                        const data = {
                            foo: {
                                body: ["for(1) { bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: unknown expression 'for(1) { bar() }' in 'foo'."
                        );
                    });

                    test("missing whitespace before body", () => {
                        const data = {
                            foo: {
                                body: ["for (1){ bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: invalid syntax in 'if/for' expression in function 'foo' (missing whitespace? I.e. 'if/for () {}')."
                        );
                    });
                });
            });
        });
    });
});
