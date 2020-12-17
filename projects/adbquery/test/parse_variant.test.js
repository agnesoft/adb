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
    describe("variant", () => {
        describe("valid", () => {
            test("two", () => {
                const data = {
                    Operator: ["And", "Or"],
                };

                const ast = {
                    Operator: {
                        type: "variant",
                        name: "Operator",
                        variants: ["And", "Or"],
                    },
                };

                expect(parser.parse(data)).toEqual(ast);
            });

            test("three", () => {
                const data = {
                    Operator: ["And", "Or", "Where"],
                };

                const ast = {
                    Operator: {
                        type: "variant",
                        name: "Operator",
                        variants: ["And", "Or", "Where"],
                    },
                };

                expect(parser.parse(data)).toEqual(ast);
            });
        });

        describe("invalid", () => {
            test("empty array as variants", () => {
                const data = {
                    MyVar: [],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: list of variants of 'MyVar' cannot be empty."
                );
            });

            test("empty string as variant", () => {
                const data = {
                    MyVar: ["Id", ""],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: variant of 'MyVar' cannot be empty."
                );
            });

            test("object as variant", () => {
                const data = {
                    MyVar: ["Id", {}],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: variant of 'MyVar' invalid ('object', must be 'string')."
                );
            });
        });
    });
});
