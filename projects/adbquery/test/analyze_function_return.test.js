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
        describe("return", () => {
            describe("invalid", () => {
                test("unknown return type", () => {
                    const data = {
                        foo: {
                            return: "Id",
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow(`Analyzer: the return type 'Id' of function 'foo' is not an existing type.`);
                });

                test("missing return statement", () => {
                    const data = {
                        Id: "Int64",
                        foo: {
                            return: "Id",
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow("Analyzer: missing return statement in function 'foo' that has a return value.");
                });
            });
        });
    });
});
