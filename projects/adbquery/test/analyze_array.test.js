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
    describe("array", () => {
        describe("valid", () => {
            test("native type", () => {
                const data = {
                    MyArr: ["int64"],
                };

                const ast = {
                    MyArr: {
                        type: "array",
                        name: "MyArr",
                        arrayType: "int64",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });

            test("custom type", () => {
                const data = {
                    SomeObj: {},
                    MyArr: ["SomeObj"],
                };

                const ast = {
                    SomeObj: {
                        type: "object",
                        name: "SomeObj",
                        functions: {},
                        fields: [],
                    },
                    MyArr: {
                        type: "array",
                        name: "MyArr",
                        arrayType: "SomeObj",
                    },
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze()).toEqual(ast);
            });
        });

        describe("invalid", () => {
            test("unknown type", () => {
                const data = {
                    MyArr: ["SomeType"],
                };

                const analyze = () => {
                    return analyzer.analyze(parser.parse(data));
                };

                expect(analyze).toThrow(
                    "Analyzer: unknown type 'SomeType' used as an array type of 'MyArr'."
                );
            });
        });
    });
});
