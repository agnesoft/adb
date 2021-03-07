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
import * as analyzer from "../compiler/analyzer.js";

describe("analyze", () => {
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

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze()).toMatchObject(ast);
                });

                test("multiple with argument", () => {
                    const data = {
                        Id: "Int64",
                        IdAlias: "Id",
                        MyObj: {
                            fields: ["Id"],
                            functions: {
                                foo: {
                                    arguments: ["IdAlias"],
                                    body: [],
                                },
                                bar: {
                                    body: ["return Id"],
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
                                    arguments: [{ name: "IdAlias" }],
                                    body: [],
                                    returnValue: undefined,
                                },
                                bar: {
                                    type: "function",
                                    name: "bar",
                                    arguments: [],
                                    body: [
                                        {
                                            type: "return",
                                            value: "Id",
                                            realType: "Int64",
                                            astType: "native",
                                            returnType: "field",
                                        },
                                    ],
                                    returnValue: "Id",
                                },
                            },
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze()).toMatchObject(ast);
                });
            });
        });
    });
});
