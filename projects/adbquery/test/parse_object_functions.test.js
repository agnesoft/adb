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
    describe("object", () => {
        describe("functions", () => {
            describe("valid", () => {
                test("single simple", () => {
                    const data = {
                        MyObj: {
                            functions: {
                                foo: { body: [] },
                            },
                        },
                    };

                    const ast = {
                        MyObj: {
                            functions: {
                                foo: {
                                    type: "function",
                                    name: "foo",
                                    arguments: [],
                                    body: [],
                                    returnValue: undefined,
                                },
                            },
                        },
                    };

                    expect(parser.parse(data)).toMatchObject(ast);
                });

                test("multiple with argument", () => {
                    const data = {
                        MyObj: {
                            functions: {
                                foo: {
                                    arguments: ["arg1"],
                                    body: ["Id = arg1"],
                                },
                                bar: {
                                    return: "Id",
                                },
                            },
                        },
                    };

                    const ast = {
                        MyObj: {
                            functions: {
                                foo: {
                                    type: "function",
                                    name: "foo",
                                    arguments: ["arg1"],
                                    body: [
                                        {
                                            type: "assignment",
                                            left: {
                                                type: "type",
                                                value: "Id",
                                            },
                                            right: {
                                                type: "type",
                                                value: "arg1",
                                            },
                                        },
                                    ],
                                },
                                bar: {
                                    type: "function",
                                    name: "bar",
                                    arguments: [],
                                    body: [],
                                    returnValue: "Id",
                                },
                            },
                        },
                    };

                    expect(parser.parse(data)).toMatchObject(ast);
                });
            });

            describe("invalid", () => {
                test("array as functions' type", () => {
                    const data = {
                        MyObj: { functions: [] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'functions' of 'MyObj' invalid ('array', must be 'object')."
                    );
                });

                test("string as function's type", () => {
                    const data = {
                        MyObj: { functions: { foo: "" } },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of function 'MyObj::foo' invalid ('string', must be 'object')."
                    );
                });
            });
        });
    });
});
