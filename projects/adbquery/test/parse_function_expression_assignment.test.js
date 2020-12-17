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
            describe("assignment", () => {
                describe("valid", () => {
                    test("type = number", () => {
                        const data = {
                            foo: { body: ["Id = 1"] },
                        };

                        const ast = {
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "type",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "number",
                                            value: 1,
                                        },
                                    },
                                ],
                            },
                        };

                        expect(parser.parse(data)).toEqual(ast);
                    });
                });

                test("type = type", () => {
                    const data = {
                        foo: { body: ["Id = From"] },
                    };

                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: [],
                            body: [
                                {
                                    type: "assignment",
                                    left: {
                                        type: "type",
                                        value: "Id",
                                    },
                                    right: {
                                        type: "type",
                                        value: "From",
                                    },
                                },
                            ],
                            returnValue: undefined,
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });

                test("type.type = type.type", () => {
                    const data = {
                        foo: { body: ["Obj.Id = Arg1.From"] },
                    };

                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: [],
                            body: [
                                {
                                    type: "assignment",
                                    left: {
                                        type: "type",
                                        value: "Id",
                                        parent: {
                                            type: "type",
                                            value: "Obj",
                                        },
                                    },
                                    right: {
                                        type: "type",
                                        value: "From",
                                        parent: {
                                            type: "type",
                                            value: "Arg1",
                                        },
                                    },
                                },
                            ],
                            returnValue: undefined,
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });

                describe("invalid", () => {
                    test("empty type", () => {
                        const data = {
                            foo: { body: ["Obj. = Arg1.From"] },
                        };

                        const parse = () => {
                            parser.parse(data);
                        };

                        expect(parse).toThrow(
                            "Parser: type name in expression in function 'foo' cannot be empty."
                        );
                    });
                });
            });
        });
    });
});
