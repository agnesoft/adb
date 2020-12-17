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
            describe("return", () => {
                describe("valid", () => {
                    test("type", () => {
                        const data = {
                            foo: {
                                body: ["return Id"],
                                return: "Id",
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: "Id",
                                        returnType: "type",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("field", () => {
                        const data = {
                            foo: {
                                body: ["return MyObj.Id"],
                                return: "Id",
                            },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: "Id",
                                        returnType: "type",
                                        parent: {
                                            type: "type",
                                            value: "MyObj",
                                        },
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });

                    test("call", () => {
                        const data = {
                            foo: { body: ["return bar()"], return: "Id" },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "return",
                                        value: "bar",
                                        arguments: [],
                                        returnType: "call",
                                    },
                                ],
                                returnValue: "Id",
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("empty string as return", () => {
                        const data = {
                            foo: { body: ["return "], return: "Id" },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: return type in expression in function 'foo' cannot be empty."
                        );
                    });
                });
            });
        });
    });
});
