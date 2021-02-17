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

import { analyzeAlias } from "./analyze_alias.js";
import { analyzeArray } from "./analyze_array.js";
import { analyzeFunction } from "./analyze_function.js";
import { analyzeObject } from "./analyze_object.js";
import { analyzeVariant } from "./analyze_variant.js";

function analyzeType(node, ast) {
    switch (node["type"]) {
        case "alias":
            analyzeAlias(node, ast);
            break;
        case "array":
            analyzeArray(node, ast);
            break;
        case "variant":
            analyzeVariant(node, ast);
            break;
        case "object":
            analyzeObject(node, ast);
            break;
        case "function":
            analyzeFunction(node, undefined, ast);
            break;
        default:
            throw `Analyzer: unknown type '${node["type"]}' named '${node["name"]}'.`;
    }
}

export function analyze(ast) {
    for (const type in ast) {
        analyzeType(ast[type], ast);
    }
}
