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
            describe("valid", () => {
                test("multiple", () => {
                    const data = {
                        foo: {
                            body: [
                                "Obj.Id = MyArr.int64",
                                "MyVar.Obj.Field1 += 1",
                            ],
                        },
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
                                        value: "int64",
                                        parent: {
                                            type: "type",
                                            value: "MyArr",
                                        },
                                    },
                                },
                                {
                                    type: "addition",
                                    left: {
                                        type: "type",
                                        value: "Field1",
                                        parent: {
                                            type: "type",
                                            value: "Obj",
                                            parent: {
                                                type: "type",
                                                value: "MyVar",
                                            },
                                        },
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

            describe("invalid", () => {
                test("empty string as expression", () => {
                    const data = {
                        foo: { body: [""] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: expression in 'body' of 'foo' cannot be empty."
                    );
                });

                test("object as expression", () => {
                    const data = {
                        foo: { body: [{}] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: expression in 'body' of 'foo' invalid ('object', must be 'string')."
                    );
                });

                test("unknown expression", () => {
                    const data = {
                        foo: { body: ["SomeType * 2"] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: unknown expression 'SomeType * 2' in 'foo'."
                    );
                });
            });
        });
    });
});
