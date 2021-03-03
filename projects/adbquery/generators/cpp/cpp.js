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

import fs from "fs";

function aliases(ast) {
    let buffer = "";

    for (const type in ast) {
        buffer += typeAlias(type, ast);
    }

    return buffer;
}

function typeAlias(type, ast) {
    switch (ast[type]["type"]) {
        case "array":
            return `using ${type} = std::vector<${realType(
                ast[type]["arrayType"],
                ast
            )}>;\n`;

        case "variant":
            return `using ${type} = std::variant<${variants(type, ast)}>;\n`;

        case "alias":
            return `using ${type} = ${realType(
                ast[type]["aliasedType"],
                ast
            )};\n`;

        default:
            return "";
    }
}

function argName(type) {
    return `${type.charAt(0).toLowerCase()}${type.substr(1)}`;
}

function fieldName(type) {
    return `m${type}`;
}

function functions(ast) {
    let buffer = "";

    for (const type in ast) {
        if (ast[type] == "function") {
            //TODO
        }
    }

    return buffer;
}

function functionArguments(type, ast) {
    let args = [];

    for (const arg of ast[type]["arguments"]) {
        args.push(realType(arg, ast));
    }

    return args.join(", ");
}

function declarations(ast) {
    let buffer = "";

    for (const type in ast) {
        if (ast[type]["usedBeforeDefined"])
            if (ast[type]["type"] == "object") {
                buffer += `class ${type};\n`;
            } else if (ast[type]["type"] == "function") {
                buffer += `auto ${type}(${functionArguments(
                    type,
                    ast
                )}) -> ${realType(ast[type]["returnValue"])};\n`;
            }
    }

    return buffer;
}

function generateSource(template, ast) {
    let buffer = template;
    buffer = buffer.replace("//!year", new Date().getUTCFullYear());
    buffer = buffer.replace("//!declarations", declarations(ast));
    buffer = buffer.replace("//!aliases", aliases(ast));
    buffer = buffer.replace("//!objects", objects(ast));
    buffer = buffer.replace("//!functions", functions(ast));
    return buffer;
}

function objectConstructorArgs(fields) {
    let args = [];

    for (const field of fields) {
        args.push(`${field} ${argName(field)}`);
    }

    return args.join(", ");
}

function objectConstructorInitializers(fields, ast) {
    if (fields.length == 0) {
        return "";
    }

    let args = [];

    for (const field of fields) {
        args.push(`        ${fieldName(field)}{${typeInitializer(field)}}`);
    }

    return ` :\n${args.join(",\n")}`;
}

function objectConstructor(def, ast) {
    return `    explicit ${def["name"]}(${objectConstructorArgs(
        def["fields"]
    )})${objectConstructorInitializers(def["fields"], ast)}
    {
    }`;
}

function objectFields(def, ast) {
    let fields = [];

    for (const field of def["fields"]) {
        fields.push(`    ${realType(field, ast)} ${fieldName(field)};`);
    }

    return fields.join("\n");
}

function objects(ast) {
    let buffer = "";

    for (const type in ast) {
        if (ast[type]["type"] == "object") {
            buffer += `
class ${type}
{
public:
${objectConstructor(ast[type], ast)}

private:
${objectFields(ast[type], ast)}
};\n`;
        }
    }

    return buffer;
}

function readTemplate() {
    return fs.readFileSync("generators/cpp/cpp.template").toString();
}

function realType(type, ast) {
    if (type in ast && ast[type]["usedBeforeDefined"]) {
        return `std::unique_ptr<${type}>`;
    } else {
        return type;
    }
}

function typeInitializer(type) {
    return `std::move(${argName(type)})`;
}

function variants(type, ast) {
    let types = [];

    for (const variant of ast[type]["variants"]) {
        types.push(realType(variant, ast));
    }

    return types.join(", ");
}

export function generate(ast, file) {
    const template = readTemplate();
    const data = generateSource(template, ast);
    fs.writeFileSync(file, data);
}
