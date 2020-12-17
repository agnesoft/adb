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
    describe("array", () => {
        describe("valid", () => {
            test("native type", () => {
                const data = {
                    String: ["byte"],
                };

                const ast = {
                    String: {
                        type: "array",
                        name: "String",
                        arrayType: "byte",
                    },
                };

                expect(parser.parse(data)).toEqual(ast);
            });
        });
        describe("invalid", () => {
            test("empty string as array type", () => {
                const data = {
                    MyArr: [""],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: type of array 'MyArr' cannot be empty."
                );
            });

            test("object as array type", () => {
                const data = {
                    MyArr: [{}],
                };

                const parse = () => {
                    parser.parse(data);
                };

                expect(parse).toThrow(
                    "Parser: type of array 'MyArr' invalid ('object', must be 'string')."
                );
            });
        });
    });
});
