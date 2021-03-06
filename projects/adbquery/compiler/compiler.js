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

const inBuilt = {
    i: "Int64",
    Offset: "Int64",
    ByteArray: ["Byte"],
    Buffer: "ByteArray",
    deserializeDouble: {
        arguments: ["Buffer", "Offset"],
        body: ["Offset = 1", "return 0"],
        return: "Double",
    },
    deserializeInt64: {
        arguments: ["Buffer", "Offset"],
        body: ["Offset = 1", "return 0"],
        return: "Int64",
    },
    serializeDouble: {
        arguments: ["Buffer", "Offset", "Double"],
        body: ["Buffer = Buffer", "Offset = 1"],
    },
    serializeInt64: {
        arguments: ["Buffer", "Offset", "Int64"],
        body: ["Buffer = Buffer", "Offset = 1"],
    },
    stringFromBuffer: {
        arguments: ["Buffer"],
        body: ["return String"],
        return: "String",
    },
    stringToBuffer: {
        arguments: ["String"],
        body: ["return Buffer"],
        return: "Buffer",
    },
    int64ToLittleEndian: {
        arguments: ["Int64"],
        body: ["return 0"],
        return: "Int64",
    },
    doubleToLittleEndian: {
        arguments: ["Double"],
        body: ["return 0"],
        return: "Double",
    },
    int64ToNativeEndian: {
        arguments: ["Int64"],
        body: ["return 0"],
        return: "Int64",
    },
    doubleToNativeEndian: {
        arguments: ["Double"],
        body: ["return 0"],
        return: "Double",
    },
};

export function compile(data) {
    const fullData = serializer.addSerialization({
        ...inBuilt,
        ...JSON.parse(data),
    });
    let ast = parser.parse(fullData);
    return analyzer.analyze(ast);
}
