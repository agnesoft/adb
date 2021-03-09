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

import * as cpptypes from "./cpp_types.js";
import * as cppfunctionexpression from "./cpp_function_expression.js";

function expressions(body, ast) {
    let exprs = [];

    for (const expression of body) {
        exprs.push(cppfunctionexpression.generate(expression, ast));
    }

    return exprs.join("\n");
}

export function declaration(func, ast) {
    return `export auto ${func["name"]}(${cpptypes.functionArguments(
        func["arguments"],
        ast
    )}) -> ${cpptypes.cppType(func["returnValue"], ast)}`;
}

export function generate(func, ast) {
    return `\n${declaration(func, ast)}
{
${expressions(func["body"], ast)}
}\n`;
}
