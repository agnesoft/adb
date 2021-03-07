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

import * as serializer from "../compiler/serializer.js";

describe("serializer", () => {
    describe("valid", () => {
        test("array", () => {
            const data = {
                MyArr: ["Int64"],
            };

            const expected = {
                serialize_MyArr: {},
                deserialize_MyArr: {},
            };

            expect(serializer.addSerialization(data)).toMatchObject(expected);
        });

        test("object", () => {
            const data = {
                MyObj: {
                    fields: ["String", "Int64"],
                },
            };

            const expected = {
                serialize_MyObj: {},
                deserialize_MyObj: {},
            };

            expect(serializer.addSerialization(data)).toMatchObject(expected);
        });

        test("variant", () => {
            const data = {
                MyVar: ["Int64", "String"],
            };

            const expected = {
                serialize_MyVar: {},
                deserialize_MyVar: {},
            };

            expect(serializer.addSerialization(data)).toMatchObject(expected);
        });

        test("function", () => {
            const data = {
                foo: { body: [] },
            };

            expect(
                "serialize_foo" in serializer.addSerialization(data)
            ).toBeFalsy();
        });

        test("alias", () => {
            const data = {
                obj: {},
                objalias: "obj",
            };

            expect(
                "serialize_objalias" in serializer.addSerialization(data)
            ).toBeFalsy();
        });
    });
});
