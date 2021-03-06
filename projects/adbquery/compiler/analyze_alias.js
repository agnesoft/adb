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

export function analyzeAlias(node, ast) {
    if (!typeExists(node["aliasedType"], ast)) {
        throw `Analyzer: unknown type '${node["aliasedType"]}' aliased as '${node["name"]}'.`;
    }

    return node;
}
