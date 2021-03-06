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
        describe("fields", () => {
            describe("valid", () => {
                test("multiple", () => {
                    const data = {
                        Id: "Int64",
                        Ids: ["Id"],
                        MyObj: {
                            fields: ["Id", "Ids"],
                        },
                    };

                    const ast = {
                        MyObj: {
                            fields: ["Id", "Ids"],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze()).toMatchObject(ast);
                });
            });

            describe("invalid", () => {
                test("unknown field type", () => {
                    const data = {
                        Id: "Int64",
                        MyObj: {
                            fields: ["Id", "Ids"],
                        },
                    };

                    const analyze = () => {
                        return analyzer.analyze(parser.parse(data));
                    };

                    expect(analyze).toThrow("Analyzer: the field 'Ids' of object 'MyObj' is not an existing type.");
                });
            });
        });
    });
});
