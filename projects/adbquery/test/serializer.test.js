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
        test("native", () => {
            const expected = {
                serialize_byte: {},
                deserialize_byte: {},
                serialize_int64: {},
                deserialize_int64: {},
                serialize_double: {},
                deserialize_double: {},
                serialize_string: {},
                deserialize_string: {},
            };

            expect(serializer.addSerialization({})).toMatchObject(expected);
        });

        test("array", () => {
            const data = { ByteArray: ["byte"] };

            const expected = {
                serialize_ByteArray: {},
                deserialize_ByteArray: {},
            };

            expect(serializer.addSerialization(data)).toMatchObject(expected);
        });

        test("object", () => {
            const data = {
                MyObj: {
                    fields: ["string", "int64"],
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
                MyVar: ["int64", "string"],
            };

            const expected = {
                serialize_MyVar: {},
                deserialize_MyVar: {},
            };

            expect(serializer.addSerialization(data)).toMatchObject(expected);
        });
    });
});
