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

function isArray(type, data) {
    return Array.isArray(data[type]) && data[type].length == 1;
}

function isObject(type, data) {
    return !isArray(type, data) && typeof data[type] == "object" && ("fields" in data[type] || !("body" in data[type]));
}

function isVariant(type, data) {
    return Array.isArray(data[type]) && data[type].length > 1;
}

function addArraySerialization(array, arrayType, data, serialization) {
    if (array == "ByteArray") {
        return;
    }

    serialization[`serialize_${array}`] = {
        arguments: ["Buffer", "Offset", array],
        body: [`serialize_Int64(Buffer, Offset, ${array}.size())`, `for (${array}.size()) { serialize_${realType(arrayType, data)}(Buffer, Offset, ${array}.at(i)) }`],
    };
    serialization[`deserialize_${array}`] = {
        arguments: ["Buffer", "Offset"],
        body: [`${array} = ${array}`, `for (deserialize_Int64(Buffer, Offset)) { ${array} += deserialize_${realType(arrayType, data)}(Buffer, Offset) }`, `return ${array}`],
        return: array,
    };
}

function fieldsSerializationExpressions(object, fields, data) {
    let expressions = [];

    if (fields) {
        for (const field of fields) {
            expressions.push(`serialize_${realType(field, data)}(Buffer, Offset, ${object}.${field})`);
        }
    }

    return expressions;
}

function fieldsDeserializationExpression(fields, data) {
    let expressions = [];

    if (fields) {
        for (const field of fields) {
            expressions.push(`deserialize_${realType(field, data)}(Buffer, Offset)`);
        }
    }

    return expressions.join(", ");
}

function addObjectSerialization(object, definition, data, serialization) {
    serialization[`serialize_${object}`] = {
        arguments: ["Buffer", "Offset", object],
        body: fieldsSerializationExpressions(object, definition["fields"], data),
    };
    serialization[`deserialize_${object}`] = {
        arguments: ["Buffer", "Offset"],
        body: [`return ${object}(${fieldsDeserializationExpression(definition["fields"], data)})`],
        return: object,
    };
}

function variantsSerializationExpressions(variant, variants, data) {
    let expressions = [`Byte = ${variant}.index()`, `serialize_Byte(Buffer, Offset, Byte)`];

    for (let i = 0; i < variants.length; i++) {
        expressions.push(`${i != 0 ? "else " : ""}if (Byte == ${i}) { serialize_${realType(variants[i], data)}(Buffer, Offset, ${variant}.${variants[i]}) }`);
    }

    return expressions;
}

function variantsDeserializationExpressions(variant, variants, data) {
    let expressions = [`Byte = deserialize_Byte(Buffer, Offset)`];

    for (let i = 0; i < variants.length; i++) {
        expressions.push(`if (Byte == ${i}) { return deserialize_${realType(variants[i], data)}(Buffer, Offset) }`);
    }

    expressions.push(`return ${variant}`);
    return expressions;
}

function addVariantSerialization(variant, variants, data, serialization) {
    serialization[`serialize_${variant}`] = {
        arguments: ["Buffer", "Offset", variant],
        body: variantsSerializationExpressions(variant, variants, data),
    };
    serialization[`deserialize_${variant}`] = {
        arguments: ["Buffer", "Offset"],
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

export function addSerialization(data) {
    let serialization = {};
    addCustomSerialization(data, serialization);
    return { ...data, ...serialization };
}
