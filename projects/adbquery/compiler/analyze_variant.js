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

import { typeExists } from "./analyzer_common.js";

export function analyzeVariant(node, ast) {
    for (const variant of node["variants"]) {
        if (!typeExists(variant, ast)) {
            throw `Analyzer: unknown type '${variant}' used as a variant of '${node["name"]}'.`;
        }
    }

    return node;
}
