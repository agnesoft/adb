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
        describe("fields", () => {
            describe("valid", () => {
                test("single", () => {
                    const data = {
                        MyObj: {
                            fields: ["field1"],
                        },
                    };

                    const ast = {
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            fields: ["field1"],
                            functions: {},
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });

                test("multiple", () => {
                    const data = {
                        MyObj: {
                            fields: ["field1", "field2"],
                        },
                    };

                    const ast = {
                        MyObj: {
                            type: "object",
                            name: "MyObj",
                            fields: ["field1", "field2"],
                            functions: {},
                        },
                    };

                    expect(parser.parse(data)).toEqual(ast);
                });
            });

            describe("invalid", () => {
                test("object as fields' type", () => {
                    const data = {
                        MyObj: {
                            fields: {},
                        },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: type of 'fields' of 'MyObj' invalid ('object', must be 'array')."
                    );
                });

                test("empty string as field", () => {
                    const data = {
                        MyObj: {
                            fields: [""],
                        },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: field in 'fields' of 'MyObj' cannot be empty."
                    );
                });

                test("object as field", () => {
                    const data = {
                        MyObj: {
                            fields: [{}],
                        },
                    };

                    const parse = () => {
                        parser.parse(data);
                    };

                    expect(parse).toThrow(
                        "Parser: field of 'MyObj' invalid ('object', must be 'string')."
                    );
                });
            });
        });
    });
});
