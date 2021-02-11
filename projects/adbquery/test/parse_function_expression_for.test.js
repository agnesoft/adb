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
                                                        type: "identifier",
                                                        value: "i",
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

                    test("function call", () => {
                        const data = {
                            foo: {
                                body: ["for (fizz(arg)) { bazz(i) }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "for",
                                        iterations: {
                                            type: "call",
                                            arguments: [
                                                {
                                                    type: "identifier",
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
                                                        type: "identifier",
                                                        value: "i",
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
                });

                describe("invalid", () => {
                    test("missing curly brackets", () => {
                        const data = {
                            foo: {
                                body: ["for(1) bar() }"],
                            },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: expected '{', got 'bar' [identifier] in 'foo'."
                        );
                    });
                });
            });
        });
    });
});
