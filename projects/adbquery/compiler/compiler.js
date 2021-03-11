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
    serialize_Byte: {
        arguments: ["Buffer", "Offset", "Byte"],
        body: ["Buffer.at(Offset) = Byte", "Offset += 1"],
    },
    deserialize_Byte: {
        arguments: ["Buffer", "Offset"],
        body: ["Byte = Buffer.at(Offset)", "Offset += 1", "return Byte"],
        return: "Byte",
    },
    serialize_Int64: {
        arguments: ["Buffer", "Offset", "Int64"],
        body: ["serializeInt64(Buffer, Offset, int64ToLittleEndian(Int64))"],
    },
    deserialize_Int64: {
        arguments: ["Buffer", "Offset"],
        body: ["return int64ToNativeEndian(deserializeInt64(Buffer, Offset))"],
        return: "Int64",
    },
    serialize_Double: {
        arguments: ["Buffer", "Offset", "Double"],
        body: ["serializeDouble(Buffer, Offset, doubleToLittleEndian(Double))"],
    },
    deserialize_Double: {
        arguments: ["Buffer", "Offset"],
        body: ["return doubleToNativeEndian(deserializeDouble(Buffer, Offset))"],
        return: "Double",
    },
    serialize_ByteArray: {
        arguments: ["Buffer", "Offset", "ByteArray"],
        body: ["serialize_Int64(Buffer, Offset, ByteArray.size())", "for (ByteArray.size()) { serialize_Byte(Buffer, Offset, ByteArray.at(i)) }"],
    },
    deserialize_ByteArray: {
        arguments: ["Buffer", "Offset"],
        body: ["ByteArray = ByteArray", "for (deserialize_Int64(Buffer, Offset)) { ByteArray += deserialize_Byte(Buffer, Offset) }", "return ByteArray"],
        return: "ByteArray",
    },
    serialize_String: {
        arguments: ["Buffer", "Offset", "String"],
        body: ["serialize_ByteArray(Buffer, Offset, stringToBuffer(String))"],
    },
    deserialize_String: {
        arguments: ["Buffer", "Offset"],
        body: ["return stringFromBuffer(deserialize_ByteArray(Buffer, Offset))"],
        return: "String",
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
