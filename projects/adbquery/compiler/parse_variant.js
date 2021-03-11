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

function validateVariants(token, variants) {
    if (variants.length == 0) {
        throw `Parser: list of variants of '${token}' cannot be empty.`;
    }

    for (const variant of variants) {
        if (jsType(variant) != "string") {
            throw `Parser: variant of '${token}' invalid ('${jsType(variant)}', must be 'string').`;
        }

        if (!variant) {
            throw `Parser: variant of '${token}' cannot be empty.`;
        }
    }
}

function variants(token, schema) {
    validateVariants(token, schema[token]);
    return schema[token];
}

export function variantAST(token, schema) {
    return {
        type: "variant",
        name: token,
        variants: variants(token, schema),
    };
}
