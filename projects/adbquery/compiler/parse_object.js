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

import { functionAST } from "./parse_function.js";
import { jsType } from "./parser_common.js";

function validateField(token, field) {
    if (jsType(field) != "string") {
        throw `Parser: field of '${token}' invalid ('${jsType(field)}', must be 'string').`;
    }

    if (!field) {
        throw `Parser: field in 'fields' of '${token}' cannot be empty.`;
    }
}

function validateFields(token, fields) {
    if (jsType(fields) != "array") {
        throw `Parser: type of 'fields' of '${token}' invalid ('${jsType(fields)}', must be 'array').`;
    }

    for (const field of fields) {
        validateField(token, field);
    }
}

function objectFields(token, schema) {
    if ("fields" in schema[token]) {
        validateFields(token, schema[token]["fields"]);
        return schema[token]["fields"];
    }

    return [];
}

function validateFunction(token, func, definition) {
    if (jsType(definition) != "object") {
        throw `Parser: type of function '${token}::${func}' invalid ('${jsType(definition)}', must be 'object').`;
    }
}

function validateFunctions(token, functions) {
    if (jsType(functions) != "object") {
        throw `Parser: type of 'functions' of '${token}' invalid ('${jsType(functions)}', must be 'object').`;
    }

    for (const func in functions) {
        validateFunction(token, func, functions[func]);
    }
}

function objectFunctions(token, schema) {
    let functions = {};

    if ("functions" in schema[token]) {
        validateFunctions(token, schema[token]["functions"]);

        for (const func in schema[token]["functions"]) {
            functions[func] = functionAST(func, schema[token]["functions"][func], token);
        }
    }

    return functions;
}

export function objectAST(token, schema) {
    return {
        type: "object",
        name: token,
        fields: objectFields(token, schema),
        functions: objectFunctions(token, schema),
    };
}
