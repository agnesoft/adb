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
    describe("alias", () => {
        describe("valid", () => {
            test("native type", () => {
                const data = {
                    Id: "Int64",
                };

                const ast = {
                    Id: {
                        type: "alias",
                        name: "Id",
                        aliasedType: "Int64",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("custom type", () => {
                const data = {
                    SomeType: {},
                    Id: "SomeType",
                };

                const ast = {
                    Id: {
                        type: "alias",
                        name: "Id",
                        aliasedType: "SomeType",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("alias of alias", () => {
                const data = {
                    Id: "Int64",
                    From: "Id",
                };

                const ast = {
                    From: {
                        type: "alias",
                        name: "From",
                        aliasedType: "Id",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("used before defined", () => {
                const data = {
                    From: "Id",
                    Id: "Int64",
                };

                const ast = {
                    Id: {
                        type: "alias",
                        name: "Id",
                        aliasedType: "Int64",
                        usedBeforeDefined: true,
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("used before defined (transitive)", () => {
                const data = {
                    To: "From",
                    From: "Id",
                    Id: "Int64",
                };

                const ast = {
                    From: {
                        type: "alias",
                        name: "From",
                        aliasedType: "Id",
                        usedBeforeDefined: true,
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });
        });

        describe("invalid", () => {
            test("unknown alias type", () => {
                const data = {
                    Id: "SomeType",
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze).toThrow("Analyzer: unknown type 'SomeType' aliased as 'Id'.");
            });
        });
    });
});
