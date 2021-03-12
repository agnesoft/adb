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

import * as compiler from "../compiler/compiler.js";

describe("serializer", () => {
    describe("valid", () => {
        test("sample scheme", () => {
            const data = JSON.stringify({
                FizzBuzz: "String",
                Id: "Int64",
                MyArr: ["Id"],
                MyVariant: ["Id", "MyArr"],
                print: {
                    arguments: ["String"],
                    body: [],
                },
                MyObj: {
                    fields: ["Id"],
                    functions: {
                        doFizzBuzz: {
                            arguments: ["Int64"],
                            body: ["if (Int64 == 15) { print(FizzBuzz) }"],
                        },
                        fizzBuzz: {
                            body: ["for(Id) { doFizzBuzz(i) }"],
                        },
                    },
                },
                main: {
                    body: ["MyObj(20)", "MyObj.fizzBuzz()"],
                },
            });

            const compile = () => {
                return compiler.compile(data);
            };

            expect(compile).not.toThrow();
        });

        test("in-built type flag", () => {
            const data = JSON.stringify({});
            const ast = compiler.compile(data);

            expect(ast["Offset"]["inBuilt"]).toBeTruthy();
            expect(ast["Buffer"]["inBuilt"]).toBeTruthy();
            expect(ast["doubleToNativeEndian"]["inBuilt"]).toBeTruthy();

            expect(ast["serialize_Byte"]["inBuilt"]).toBeFalsy();
            expect(ast["deserialize_String"]["inBuilt"]).toBeFalsy();
        });
    });

    describe("invalid", () => {
        test("invalid json", () => {
            const data = "{";

            const compile = () => {
                return compiler.compile(data);
            };

            expect(compile).toThrow("Unexpected end of JSON input");
        });
    });
});
