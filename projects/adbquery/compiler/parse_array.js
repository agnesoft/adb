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

import { jsType } from "./parser_common.js";

function validateArrayType(token, type) {
    if (jsType(type) != "string") {
        throw `Parser: type of array '${token}' invalid ('${jsType(
            type
        )}', must be 'string').`;
    }

    if (!type) {
        throw `Parser: type of array '${token}' cannot be empty.`;
    }
}

function arrayType(token, schema) {
    validateArrayType(token, schema[token][0]);
    return schema[token][0];
}

export function arrayAST(token, schema) {
    return {
        type: "array",
        name: token,
        arrayType: arrayType(token, schema),
    };
}
