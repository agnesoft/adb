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

import { aliasAST } from "./parse_alias.js";
import { arrayAST } from "./parse_array.js";
import { isFunction, functionAST } from "./parse_function.js";
import { objectAST } from "./parse_object.js";
import { variantAST } from "./parse_variant.js";

function tokenType(token, schema) {
    if (Array.isArray(schema[token])) {
        return "array";
    } else {
        return typeof schema[token];
    }
}

function parseArrayToken(token, schema) {
    if (schema[token].length == 1) {
        return arrayAST(token, schema);
    } else {
        return variantAST(token, schema);
    }
}

function parseObjectToken(token, schema) {
    if (isFunction(token, schema)) {
        return functionAST(token, schema[token]);
    } else {
        return objectAST(token, schema);
    }
}

function parseStringToken(token, schema) {
    return aliasAST(token, schema);
}

function parseToken(token, schema) {
    const type = tokenType(token, schema);

    switch (type) {
        case "string":
            return parseStringToken(token, schema);
        case "array":
            return parseArrayToken(token, schema);
        case "object":
            return parseObjectToken(token, schema);
        default:
            throw `Unknown token type '${type}' of token '${token}'.`;
    }
}

export function parse(schema) {
    let ast = {};

    for (const token in schema) {
        ast[token] = parseToken(token, schema);
    }

    return ast;
}
