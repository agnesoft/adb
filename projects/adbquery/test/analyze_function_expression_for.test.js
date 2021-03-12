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
            describe("for", () => {
                describe("valid", () => {
                    test("literal value", () => {
                        const data = {
                            i: "Int64",
                            bar: {
                                arguments: ["Int64"],
                                body: [],
                            },
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
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bar",
                                                arguments: [
                                                    {
                                                        type: "local",
                                                        value: "i",
                                                        realType: "Int64",
                                                        astType: "native",
                                                    },
                                                ],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("function call", () => {
                        const data = {
                            i: "Int64",
                            fizz: {
                                body: ["return 5"],
                                return: "Int64",
                            },
                            bazz: {
                                arguments: ["Int64"],
                                body: [],
                            },
                            foo: {
                                body: ["for (fizz()) { bazz(i) }"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "for",
                                        iterations: {
                                            type: "call",
                                            arguments: [],
                                            realType: "Int64",
                                            astType: "native",
                                            value: "fizz",
                                        },
                                        body: [
                                            {
                                                type: "call",
                                                value: "bazz",
                                                arguments: [
                                                    {
                                                        type: "local",
                                                        value: "i",
                                                        realType: "Int64",
                                                        astType: "native",
                                                    },
                                                ],
                                                realType: undefined,
                                                astType: undefined,
                                            },
                                        ],
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });
                });

                describe("invalid", () => {
                    test("wrong iterations type", () => {
                        const data = {
                            i: "Int64",
                            Obj: {},
                            fizz: {
                                body: ["return Obj()"],
                                return: "Obj",
                            },
                            bazz: {
                                arguments: ["Int64"],
                                body: [],
                            },
                            foo: {
                                body: ["for (fizz()) { bazz(i) }"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(`Analyzer: invalid expression in function 'foo'. The 'for' iterations' type must be a numeric type, got 'Obj'.`);
                    });
                });
            });
        });
    });
});
