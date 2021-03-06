// Copyright 2021 Agnesoft
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

import fs from "fs";
import * as cppalias from "./cpp_alias.js";
import * as cpparray from "./cpp_array.js";
import * as cppfunction from "./cpp_function.js";
import * as cppobject from "./cpp_object.js";
import * as cppvariant from "./cpp_variant.js";

function data(ast) {
    let buffer = forwardDeclarations(ast) + "\n\n";

    for (const type in ast) {
        if (isUserDefined(type)) {
            buffer += generateType(type, ast);
        }
    }

    return buffer;
}

function generateSource(template, ast) {
    let buffer = template;
    buffer = buffer.replace("//!year", new Date().getUTCFullYear());
    buffer = buffer.replace("//!data", data(ast));
    return buffer;
}

function generateType(type, ast) {
    switch (ast[type]["type"]) {
        case "alias":
            return cppalias.generate(type, ast);
        case "array":
            return cpparray.generate(type, ast);
        case "function":
            return cppfunction.generate(ast[type], ast);
        case "object":
            return cppobject.generate(type, ast);
        case "variant":
            return cppvariant.generate(type, ast);
    }
}

function forwardDeclarations(ast) {
    let buffer = "";

    for (const type in ast) {
        if (ast[type]["usedBeforeDefined"]) {
            buffer += `class ${type};`;
        }
    }

    return buffer;
}

function isUserDefined(type) {
    return ![
        "byte",
        "ByteArray",
        "int64",
        "i",
        "index",
        "offset",
        "string",
        "deserializeDouble",
        "deserializeInt64",
        "serializeDouble",
        "serializeInt64",
        "stringFromByteArray",
        "stringToByteArray",
        "int64ToLittleEndian",
        "doubleToLittleEndian",
        "int64ToNativeEndian",
        "doubleToNativeEndian",
    ].includes(type);
}

export function generate(ast, file) {
    const template = fs.readFileSync("generators/cpp/cpp.template").toString();
    const data = generateSource(template, ast);
    fs.writeFileSync(file, data);
}
