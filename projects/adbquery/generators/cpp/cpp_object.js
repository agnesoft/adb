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
import * as cppfunction from "./cpp_function.js";

function constructor(type, ast) {
    return `    ${explicit(type, ast)}${type}(${cpptypes.functionArguments(
        ast[type]["fields"],
        ast
    )})${initializers(ast[type]["fields"])}
    {
    }`;
}

function explicit(type, ast) {
    if (ast[type]["fields"].length == 1) {
        return "explicit ";
    } else {
        return "";
    }
}

function fields(fields, ast) {
    let declarations = [];

    for (const field of fields) {
        declarations.push(cpptypes.fieldDeclaration(field, ast));
    }

    return declarations.join("\n");
}

function functions(type, ast) {
    let buffer = "";

    for (const func in ast[type]["functions"]) {
        buffer += cppfunction.generate(ast[type]["functions"][func], ast);
    }

    return buffer;
}

function initializers(fields) {
    if (fields.length == 0) {
        return "";
    }

    let inits = [];

    for (const field of fields) {
        inits.push(
            `        ${cpptypes.fieldName(
                field
            )}{std::move(${cpptypes.variableName(field)})}`
        );
    }

    return ` :\n${inits.join(",\n")}`;
}

export function generate(type, ast) {
    return `\nclass ${type}
{
public:
${constructor(type, ast)}
${functions(type, ast)}
private:
${fields(ast[type]["fields"], ast)}
};\n`;
}
