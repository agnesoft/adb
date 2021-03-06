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

export function cppType(type, ast) {
    if (type in ast && ast[type]["usedBeforeDefined"]) {
        return `std::unique_ptr<${type}>`;
    }

    if (type) {
        return type;
    }

    return "void";
}

export function fieldDeclaration(type, ast) {
    return `    ${cppType(type, ast)} ${fieldName(type)};`;
}

export function fieldName(type) {
    return `m${type}`;
}

export function functionArguments(types, ast) {
    let vars = [];

    for (const type of types) {
        vars.push(`${cppType(type, ast)} ${variableName(type)}`);
    }

    return vars.join(", ");
}

export function variableDeclaration(type, ast) {
    return `${cppType(type, ast)} ${variableName(type)};`;
}

export function variableName(type) {
    if (/^[a-z]/.test(type)) {
        return `${type}_`;
    } else {
        return `${type.charAt(0).toLowerCase()}${type.substr(1)}`;
    }
}
