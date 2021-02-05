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

import * as parser from "./parser.js";
import * as analyzer from "./analyzer.js";
import * as serializer from "./serializer.js";

export function compile(data) {
    let jsonData = {
        offset: "int64",
        ByteArray: ["byte"],
        deserializeDouble: {
            arguments: ["ByteArray", "offset"],
            body: ["return 0"],
            return: "double",
        },
        deserializeInt64: {
            arguments: ["ByteArray", "offset"],
            body: ["return 0"],
            return: "int64",
        },
        serializeDouble: {
            arguments: ["ByteArray", "offset", "double"],
            body: [],
        },
        serializeInt64: {
            arguments: ["ByteArray", "offset", "int64"],
            body: [],
        },
        stringFromByteArray: {
            arguments: ["ByteArray"],
            body: ["return string"],
            return: "string",
        },
        stringToByteArray: {
            arguments: ["string"],
            body: ["return ByteArray"],
            return: "ByteArray",
        },
        int64ToLittleEndian: {
            arguments: ["int64"],
            body: ["return 0"],
            return: "int64",
        },
        doubleToLittleEndian: {
            arguments: ["double"],
            body: ["return 0"],
            return: "double",
        },
        int64ToNativeEndian: {
            arguments: ["int64"],
            body: ["return 0"],
            return: "int64",
        },
        doubleToNativeEndian: {
            arguments: ["double"],
            body: ["return 0"],
            return: "double",
        },
        ...JSON.parse(data),
    };

    let internalData = serializer.addSerialization(jsonData);
    return analyzer.analyze(parser.parse(internalData));
}
