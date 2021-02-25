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

function declarations(ast) {
    let buffer = "";

    for (const type in ast) {
        if (ast[type]["type"] == "object") {
            buffer += `class ${type};
`;
        }
    }

    return buffer;
}

function aliases(ast) {
    let buffer = "";

    for (const type in ast) {
        if (ast[type]["type"] == "array") {
            buffer += `using ${type} = std::vector<${ast[type]["arrayType"]}>;
`;
        } else if (ast[type]["type"] == "variant") {
            buffer += `using ${type} = std::variant<${ast[type][
                "variants"
            ].join(", ")}>;
`;
        } else if (ast[type]["type"] == "alias") {
            buffer += `using ${type} = ${ast[type]["aliasedType"]};
`;
        }
    }

    return buffer;
}

function argName(type) {
    return `${type.charAt(0).toLowerCase()}${type.substr(1)}`;
}

function fieldName(type) {
    return `m${type}`;
}

function objectConstructorArgs(fields) {
    let args = [];

    for (const field of fields) {
        args.push(`${field} ${argName(field)}`);
    }

    return args.join(", ");
}

function objectConstructorInitializers(fields) {
    if (fields.length == 0) {
        return "";
    }

    let args = [];

    for (const field of fields) {
        args.push(`        ${fieldName(field)}{${argName(field)}}`);
    }

    return ` :
${args.join(",\n")}`;
}

function objectConstructor(def) {
    return `    explicit ${def["name"]}(${objectConstructorArgs(
        def["fields"]
    )})${objectConstructorInitializers(def["fields"])}
    {
    }`;
}

function objectFields(def) {
    let fields = [];

    for (const field of def["fields"]) {
        fields.push(`    ${field} ${fieldName(field)};`);
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
${objectConstructor(ast[type])}

private:
${objectFields(ast[type])}
};
`;
        }
    }

    return buffer;
}

function functions(ast) {
    return "";
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

function readTemplate() {
    return fs.readFileSync("generators/cpp/cpp.template").toString();
}

export function generate(ast, file) {
    const template = readTemplate();
    const data = generateSource(template, ast);
    fs.writeFileSync(file, data);
}
