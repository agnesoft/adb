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

export function isNative(type) {
    return ["Byte", "Double", "Int64", "String"].includes(type);
}

export function typeExists(type, ast) {
    return type && (isNative(type) || type in ast);
}

export function realType(type, ast) {
    if (!isNaN(type)) {
        return "Int64";
    }

    if (isNative(type)) {
        return type;
    }

    if (!type || !(type in ast)) {
        return undefined;
    }

    if (ast[type]["type"] == "alias") {
        return realType(ast[type]["aliasedType"], ast);
    }

    return type;
}

export function astType(type, ast) {
    if (!isNaN(type)) {
        return "number";
    }

    if (isNative(type)) {
        return "native";
    }

    if (!type || !(type in ast)) {
        return undefined;
    }

    return ast[type]["type"];
}
