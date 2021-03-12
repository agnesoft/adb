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
            describe("assignment", () => {
                describe("valid", () => {
                    test("type = 1", () => {
                        const data = {
                            Id: "Int64",
                            foo: {
                                body: ["Id = 1"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "=",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "number",
                                            value: 1,
                                            realType: "Int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("type = type", () => {
                        const data = {
                            Id: "Int64",
                            From: "Int64",
                            foo: {
                                arguments: ["From"],
                                body: ["Id = From"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "=",
                                        left: {
                                            type: "new",
                                            realType: "Int64",
                                            astType: "native",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "argument",
                                            realType: "Int64",
                                            astType: "native",
                                            value: "From",
                                        },
                                    },
                                ],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toMatchObject(ast);
                    });

                    test("type = alias", () => {
                        const data = {
                            Id: "Int64",
                            From: "Id",
                            MyFrom: "From",
                            foo: {
                                arguments: ["MyFrom"],
                                body: ["Id = MyFrom"],
                            },
                        };

                        const ast = {
                            foo: {
                                body: [
                                    {
                                        type: "=",
                                        left: {
                                            type: "new",
                                            realType: "Int64",
                                            astType: "native",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "argument",
                                            realType: "Int64",
                                            astType: "native",
                                            value: "MyFrom",
                                        },
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
                    test("<unknown type> = type", () => {
                        const data = {
                            Id: "Int64",
                            foo: {
                                arguments: ["Id"],
                                body: ["MyArr = Id"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Unknown type 'MyArr'.");
                    });

                    test("type = <incompatible type>", () => {
                        const data = {
                            Id: "Int64",
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["Id = SomeType"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Cannot assign 'SomeType' (aka SomeType [object]) to 'Id' (aka Int64 [native]).");
                    });

                    test("type = incorrect variant", () => {
                        const data = {
                            Id: "Int64",
                            MyVar: ["Int64", "Double"],
                            OtherVar: "MyVar",
                            foo: {
                                arguments: ["MyVar"],
                                body: ["MyVar = Int64.String"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow("Analyzer: invalid expression in function 'foo'. Invalid parent 'Int64' (aka Int64 [native]) of 'String' (aka String [native]).");
                    });
                });
            });
        });
    });
});
