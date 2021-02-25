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

function realType(type, data) {
    let real = type;

    while (typeof data[real] == "string") {
        real = data[real];
    }

    return real;
}

function addByteSerialization(data) {
    data["serialize_byte"] = {
        arguments: ["ByteArray", "offset", "byte"],
        body: ["ByteArray.at(offset) = byte", "offset += 1"],
    };
    data["deserialize_byte"] = {
        arguments: ["ByteArray", "offset"],
        body: ["byte = ByteArray.at(offset)", "offset += 1", "return byte"],
        return: "byte",
    };
}

function addInt64Serialization(data) {
    data["serialize_int64"] = {
        arguments: ["ByteArray", "offset", "int64"],
        body: ["serializeInt64(ByteArray, offset, int64ToLittleEndian(int64))"],
    };
    data["deserialize_int64"] = {
        arguments: ["ByteArray", "offset"],
        body: [
            "return int64ToNativeEndian(deserializeInt64(ByteArray, offset))",
        ],
        return: "int64",
    };
}

function addDoubleSerialization(data) {
    data["serialize_double"] = {
        arguments: ["ByteArray", "offset", "double"],
        body: [
            "serializeDouble(ByteArray, offset, doubleToLittleEndian(int64))",
        ],
    };
    data["deserialize_double"] = {
        arguments: ["ByteArray", "offset"],
        body: [
            "return doubleToNativeEndian(deserializeDouble(ByteArray, offset))",
        ],
        return: "double",
    };
}

function addStringSerialization(data) {
    data["serialize_string"] = {
        arguments: ["ByteArray", "offset", "string"],
        body: [
            "serialize_ByteArray(ByteArray, offset, stringToByteArray(string))",
        ],
    };
    data["deserialize_string"] = {
        arguments: ["ByteArray", "offset"],
        body: [
            "return stringFromByteArray(deserialize_ByteArray(ByteArray, offset))",
        ],
        return: "string",
    };
}

function isArray(type, data) {
    return Array.isArray(data[type]) && data[type].length == 1;
}

function isObject(type, data) {
    return (
        !isArray(type, data) &&
        typeof data[type] == "object" &&
        ("fields" in data[type] || !("body" in data[type]))
    );
}

function isVariant(type, data) {
    return Array.isArray(data[type]) && data[type].length > 1;
}

function addArraySerialization(array, arrayType, data, serialization) {
    serialization[`serialize_${array}`] = {
        arguments: ["ByteArray", "offset", array],
        body: [
            `serialize_int64(ByteArray, offset, ${array}.size())`,
            `for (${array}.size()) { serialize_${realType(
                arrayType,
                data
            )}(ByteArray, offset, ${array}.at(i)) }`,
        ],
    };
    serialization[`deserialize_${array}`] = {
        arguments: ["ByteArray", "offset"],
        body: [
            `${array} = ${array}`,
            `for (deserialize_int64(ByteArray, offset)) { ${array} += deserialize_${realType(
                arrayType,
                data
            )}(ByteArray, offset) }`,
            `return ${array}`,
        ],
        return: array,
    };
}

function fieldsSerializationExpressions(object, fields, data) {
    let expressions = [];

    if (fields) {
        for (const field of fields) {
            expressions.push(
                `serialize_${realType(
                    field,
                    data
                )}(ByteArray, offset, ${object}.${field})`
            );
        }
    }

    return expressions;
}

function fieldsDeserializationExpression(fields, data) {
    let expressions = [];

    if (fields) {
        for (const field of fields) {
            expressions.push(
                `deserialize_${realType(field, data)}(ByteArray, offset)`
            );
        }
    }

    return expressions.join(", ");
}

function addObjectSerialization(object, definition, data, serialization) {
    serialization[`serialize_${object}`] = {
        arguments: ["ByteArray", "offset", object],
        body: fieldsSerializationExpressions(
            object,
            definition["fields"],
            data
        ),
    };
    serialization[`deserialize_${object}`] = {
        arguments: ["ByteArray", "offset"],
        body: [
            `return ${object}(${fieldsDeserializationExpression(
                definition["fields"],
                data
            )})`,
        ],
        return: object,
    };
}

function variantsSerializationExpressions(variant, variants, data) {
    let expressions = [
        `byte = ${variant}.index()`,
        `serialize_byte(ByteArray, offset, byte)`,
    ];
    for (let i = 0; i < variants.length; i++) {
        expressions.push(
            `${i != 0 ? "else " : ""}if (byte == ${i}) { serialize_${realType(
                variants[i],
                data
            )}(ByteArray, offset, ${variant}.${variants[i]}) }`
        );
    }
    return expressions;
}

function variantsDeserializationExpressions(variant, variants, data) {
    let expressions = [`byte = deserialize_byte(ByteArray, offset)`];
    for (let i = 0; i < variants.length; i++) {
        expressions.push(
            `if (byte == ${i}) { return deserialize_${realType(
                variants[i],
                data
            )}(ByteArray, offset) }`
        );
    }
    expressions.push(`return ${variant}`);
    return expressions;
}

function addVariantSerialization(variant, variants, data, serialization) {
    serialization[`serialize_${variant}`] = {
        arguments: ["ByteArray", "offset", variant],
        body: variantsSerializationExpressions(variant, variants, data),
    };
    serialization[`deserialize_${variant}`] = {
        arguments: ["ByteArray", "offset"],
        body: variantsDeserializationExpressions(variant, variants, data),
        return: variant,
    };
}

function addCustomSerialization(data, serialization) {
    for (const type in data) {
        if (isArray(type, data)) {
            addArraySerialization(type, data[type][0], data, serialization);
        } else if (isVariant(type, data)) {
            addVariantSerialization(type, data[type], data, serialization);
        } else if (isObject(type, data)) {
            addObjectSerialization(type, data[type], data, serialization);
        }
    }
}

function addNativeSerialization(data) {
    addByteSerialization(data);
    addInt64Serialization(data);
    addDoubleSerialization(data);
    addStringSerialization(data);
}

export function addSerialization(data) {
    let serialization = {};
    addNativeSerialization(serialization);
    addCustomSerialization(data, serialization);
    return { ...data, ...serialization };
}
