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
                                body: [
                                    {
                                        type: "=",
                                        left: {
                                            type: "identifier",
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

                        expect(parser.parse(data)).toMatchObject(ast);
                    });
                });

                test("type = type", () => {
                    const data = {
                        foo: { body: ["Id = From"] },
                    };

                    const ast = {
                        foo: {
                            body: [
                                {
                                    type: "=",
                                    left: {
                                        type: "identifier",
                                        value: "Id",
                                    },
                                    right: {
                                        type: "identifier",
                                        value: "From",
                                    },
                                },
                            ],
                        },
                    };

                    expect(parser.parse(data)).toMatchObject(ast);
                });

                test("type.type = type.type", () => {
                    const data = {
                        foo: { body: ["Obj.Id = Arg1.From"] },
                    };

                    const ast = {
                        foo: {
                            body: [
                                {
                                    type: "=",
                                    left: {
                                        type: "identifier",
                                        value: "Id",
                                        parent: {
                                            type: "identifier",
                                            value: "Obj",
                                        },
                                    },
                                    right: {
                                        type: "identifier",
                                        value: "From",
                                        parent: {
                                            type: "identifier",
                                            value: "Arg1",
                                        },
                                    },
                                },
                            ],
                        },
                    };

                    expect(parser.parse(data)).toMatchObject(ast);
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
                            "Parser: expected an identifier, got '=' [operator] in 'foo'."
                        );
                    });
                });
            });
        });
    });
});
