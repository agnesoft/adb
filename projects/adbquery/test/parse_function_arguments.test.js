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
        describe("arguments", () => {
            describe("valid", () => {
                test("single", () => {
                    const data = {
                        foo: { arguments: ["arg1"] },
                    };

                    const ast = {
                        foo: {
                            arguments: [
                                {
                                    value: "arg1",
                                },
                            ],
                        },
                    };

                    expect(parser.parse(data)).toMatchObject(ast);
                });

                test("multiple", () => {
                    const data = {
                        foo: { arguments: ["arg1", "arg2"] },
                    };

                    const ast = {
                        foo: {
                            arguments: [
                                {
                                    value: "arg1",
                                },
                                {
                                    value: "arg2",
                                },
                            ],
                        },
                    };

                    expect(parser.parse(data)).toMatchObject(ast);
                });
            });
            describe("invalid", () => {
                test("object as arguments' type", () => {
                    const data = {
                        foo: { arguments: {} },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'arguments' of 'foo' invalid ('object', must be 'array')."
                    );
                });

                test("empty string as argument", () => {
                    const data = {
                        foo: { arguments: [""] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: argument in 'arguments' of 'foo' cannot be empty."
                    );
                });

                test("object as argument", () => {
                    const data = {
                        foo: { arguments: [{}] },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: argument in 'arguments' of 'foo' invalid ('object', must be 'string')."
                    );
                });
            });
        });
    });
});
