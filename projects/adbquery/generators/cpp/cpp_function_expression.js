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

function additionExpr(expression, ast) {
    if (expression["left"]["astType"] == "array") {
        return `    ${side(expression["left"], ast)}.push_back(${side(
            expression["right"],
            ast
        )});`;
    } else {
        return `    ${side(expression["left"], ast)} += ${side(
            expression["right"],
            ast
        )};`;
    }
}

function assignmentExpr(expression, ast) {
    if (expression["left"]["value"] == expression["right"]["value"]) {
        return `    ${side(expression["left"], ast)};`;
    }

    return `    ${side(expression["left"], ast)} = ${side(
        expression["right"],
        ast
    )};`;
}

function callExpr(expression, ast) {
    return `    ${side(expression, ast)};`;
}

function elseExpr(expression, ast) {
    return `    else {
        ${generate(expression["body"][0], ast)}
    }`;
}

function forExpr(expression, ast) {
    return `    for (Int64 i_ = 0; i_ < ${side(
        expression["iterations"],
        ast
    )}; i_++) {
    ${generate(expression["body"][0], ast)}
    }`;
}

function functionArguments(expression, ast) {
    let args = [];

    for (const arg of expression["arguments"]) {
        args.push(side(arg, ast));
    }

    return args.join(", ");
}

function ifExpr(expression, ast, elseif = "") {
    return `    ${elseif}if (${side(expression["condition"]["left"], ast)} ${
        expression["condition"]["type"]
    } ${side(expression["condition"]["right"], ast)}) {
    ${generate(expression["body"][0], ast)}
    }`;
}

function parent(expression, ast) {
    if (!expression["parent"]) {
        return "";
    }

    const type = expression["parent"]["value"];

    if (type in ast && ast[type]["usedBeforeDefined"]) {
        return `${side(expression["parent"], ast)}->`;
    } else {
        return `${side(expression["parent"], ast)}.`;
    }
}

function returnExpr(expression, ast) {
    return `    return ${side(expression, ast)};`;
}

function side(expression, ast) {
    const type =
        "returnType" in expression
            ? expression["returnType"]
            : expression["type"];

    if (type == "variant") {
        return `std::get<${cpptypes.cppType(expression["value"], ast)}>(${side(
            expression["parent"],
            ast
        )})`;
    }

    if (type == "call" || type == "method") {
        return `${parent(expression, ast)}${
            expression["value"]
        }(${functionArguments(expression, ast)})`;
    }

    if (type == "constructor") {
        if (ast[expression["value"]]["usedBeforeDefined"]) {
            return `std::make_unique<${
                expression["value"]
            }>(${functionArguments(expression, ast)})`;
        } else {
            return `${expression["value"]}(${functionArguments(
                expression,
                ast
            )})`;
        }
    }

    if (type == "number") {
        return expression["value"];
    } else if (type == "new") {
        if ("returnType" in expression) {
            return `{}`;
        } else {
            return `${cpptypes.variableDeclaration(expression["value"], ast)}`;
        }
    } else if (type == "field") {
        return `${parent(expression, ast)}${cpptypes.fieldName(
            expression["value"]
        )}`;
    } else {
        return cpptypes.variableName(expression["value"]);
    }
}

export function generate(expression, ast) {
    switch (expression["type"]) {
        case "+=":
            return additionExpr(expression, ast);
        case "=":
            return assignmentExpr(expression, ast);
        case "call":
            return callExpr(expression, ast);
        case "else":
            return elseExpr(expression, ast);
        case "elseif":
            return ifExpr(expression, ast, "else ");
        case "for":
            return forExpr(expression, ast);
        case "if":
            return ifExpr(expression, ast);
        case "return":
            return returnExpr(expression, ast);
    }

    return "";
}
