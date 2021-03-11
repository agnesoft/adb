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
    describe("function", () => {
        describe("expression", () => {
            describe("invalid", () => {
                test("unknown expression type", () => {
                    const ast = {
                        foo: {
                            type: "function",
                            name: "foo",
                            arguments: [],
                            returnValue: undefined,
                            body: [
                                {
                                    type: "unknown_type",
                                },
                            ],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(ast);
                    };

                    expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Unknown expression type 'unknown_type'.");
                });

                test("incorrect expression part", () => {
                    const data = {
                        Id: "Int64",
                        MyVar: ["Int64", "Byte"],
                        foo: {
                            arguments: ["MyVar"],
                            body: ["MyVar.Id = 1"],
                        },
                    };

                    const analyze = () => {
                        analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(`Analyzer: invalid expression in function 'foo'. Invalid parent 'MyVar' (aka MyVar [variant]) of 'Id' (aka Int64 [native]).`);
                });

                test("bad expression in method", () => {
                    const data = {
                        Id: "Int64",
                        MyVar: ["Int64", "Byte"],
                        SomeObj: {
                            functions: {
                                foo: {
                                    arguments: ["MyVar"],
                                    body: ["MyVar.Id = 1"],
                                },
                            },
                        },
                    };

                    const analyze = () => {
                        analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(`Analyzer: invalid expression in function 'SomeObj::foo'. Invalid parent 'MyVar' (aka MyVar [variant]) of 'Id' (aka Int64 [native]).`);
                });
            });
        });
    });
});
