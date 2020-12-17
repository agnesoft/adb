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
                            Id: "int64",
                            foo: {
                                body: ["Id = 1"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: [],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "new",
                                            value: "Id",
                                            realType: "int64",
                                            astType: "native",
                                        },
                                        right: {
                                            type: "number",
                                            value: 1,
                                            realType: "int64",
                                            astType: "native",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("type = type", () => {
                        const data = {
                            Id: "int64",
                            From: "int64",
                            foo: {
                                arguments: ["From"],
                                body: ["Id = From"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            From: {
                                type: "alias",
                                name: "From",
                                aliasedType: "int64",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["From"],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "new",
                                            realType: "int64",
                                            astType: "native",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "argument",
                                            realType: "int64",
                                            astType: "native",
                                            value: "From",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });

                    test("type = alias", () => {
                        const data = {
                            Id: "int64",
                            From: "Id",
                            MyFrom: "From",
                            foo: {
                                arguments: ["MyFrom"],
                                body: ["Id = MyFrom"],
                            },
                        };

                        const ast = {
                            Id: {
                                type: "alias",
                                name: "Id",
                                aliasedType: "int64",
                            },
                            From: {
                                type: "alias",
                                name: "From",
                                aliasedType: "Id",
                            },
                            MyFrom: {
                                type: "alias",
                                name: "MyFrom",
                                aliasedType: "From",
                            },
                            foo: {
                                type: "function",
                                name: "foo",
                                arguments: ["MyFrom"],
                                body: [
                                    {
                                        type: "assignment",
                                        left: {
                                            type: "new",
                                            realType: "int64",
                                            astType: "native",
                                            value: "Id",
                                        },
                                        right: {
                                            type: "argument",
                                            realType: "int64",
                                            astType: "native",
                                            value: "MyFrom",
                                        },
                                    },
                                ],
                                returnValue: undefined,
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze()).toEqual(ast);
                    });
                });

                describe("invalid", () => {
                    test("<unknown type> = type", () => {
                        const data = {
                            Id: "int64",
                            foo: {
                                arguments: ["Id"],
                                body: ["MyArr = Id"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: invalid expression in function 'foo'. Unknown type 'MyArr'."
                        );
                    });

                    test("type = <incompatible type>", () => {
                        const data = {
                            Id: "int64",
                            SomeType: {},
                            foo: {
                                arguments: ["SomeType"],
                                body: ["Id = SomeType"],
                            },
                        };

                        const analyze = () => {
                            return analyzer.analyze(parser.parse(data));
                        };

                        expect(analyze).toThrow(
                            "Analyzer: invalid expression in function 'foo'. Cannot assign 'SomeType' (aka SomeType [object]) to 'Id' (aka int64 [native])."
                        );
                    });
                });
            });
        });
    });
});
