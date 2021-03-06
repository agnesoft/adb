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
        describe("valid", () => {
            test("empty", () => {
                const data = {
                    MyObj: {},
                };

                const ast = {
                    MyObj: {
                        type: "object",
                        name: "MyObj",
                        functions: {},
                        fields: [],
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });

            test("used before definition (array)", () => {
                const data = {
                    MyArr: ["MyObj"],
                    MyObj: {},
                };

                const ast = {
                    MyObj: {
                        type: "object",
                        name: "MyObj",
                        functions: {},
                        fields: [],
                        usedBeforeDefined: true,
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("used before definition (variant)", () => {
                const data = {
                    MyVariant: ["Int64", "Byte", "MyObj"],
                    MyObj: {},
                };

                const ast = {
                    MyObj: {
                        type: "object",
                        name: "MyObj",
                        functions: {},
                        fields: [],
                        usedBeforeDefined: true,
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("used before definition (object field)", () => {
                const data = {
                    OtherObj: { fields: ["MyObj"] },
                    MyObj: {},
                };

                const ast = {
                    MyObj: {
                        type: "object",
                        name: "MyObj",
                        functions: {},
                        fields: [],
                        usedBeforeDefined: true,
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toMatchObject(ast);
            });

            test("used before definition (alias)", () => {
                const data = {
                    AliasedObj: "MyObj",
                    MyArr: ["AliasedObj"],
                    MyObj: {},
                };

                const ast = {
                    MyObj: {
                        type: "object",
                        name: "MyObj",
                        functions: {},
                        fields: [],
                        usedBeforeDefined: true,
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
