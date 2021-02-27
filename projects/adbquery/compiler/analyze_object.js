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

import { realType, typeExists } from "./analyzer_common.js";
import { analyzeFunction } from "./analyze_function.js";

function validateFieldTypeExists(field, node, ast) {
    if (!typeExists(field, ast)) {
        throw `Analyzer: the field '${field}' of object '${node["name"]}' is not an existing type.`;
    }
}

function validateField(field, node, ast) {
    validateFieldTypeExists(field, node, ast);
}

function validateFields(node, ast) {
    for (const field of node["fields"]) {
        validateField(field, node, ast);
    }
}

function analyzeFunctions(node, ast) {
    for (const func in node["functions"]) {
        analyzeFunction(node["functions"][func], node, ast);
    }
}

function detectUseBeforeDefined(node, ast) {
    for (const type in ast) {
        if (type == node["name"]) {
            return;
        }

        if (ast[type]["type"] == "variant") {
            for (const variant of ast[type]["variants"]) {
                if (realType(variant, ast) == node["name"]) {
                    node["usedBeforeDefined"] = true;
                    return;
                }
            }
        } else if (ast[type]["type"] == "array") {
            if (realType(ast[type]["arrayType"], ast) == node["name"]) {
                node["usedBeforeDefined"] = true;
                return;
            }
        } else if (ast[type]["type"] == "object") {
            for (const field of ast[type]["fields"]) {
                if (realType(field, ast) == node["name"]) {
                    node["usedBeforeDefined"] = true;
                    return;
                }
            }
        }
    }
}

export function analyzeObject(node, ast) {
    validateFields(node, ast);
    analyzeFunctions(node, ast);
    detectUseBeforeDefined(node, ast);
}
