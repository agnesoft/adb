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
        return `    ${side(expression["left"], ast)}.push_back(${side(expression["right"], ast)});`;
    } else {
        return `    ${side(expression["left"], ast)} += ${side(expression["right"], ast)};`;
    }
}

function assignmentExpr(expression, ast) {
    if (expression["left"]["value"] == expression["right"]["value"]) {
        return `    ${side(expression["left"], ast)};`;
    }

    return `    ${side(expression["left"], ast)} = ${side(expression["right"], ast)};`;
}

function call(expression, ast) {
    if (requiresStrictEvaluationOrder(expression, ast)) {
        return `[${evaluatedArgumentsDeclarations(expression, ast)}]() mutable {
            ${strictCallReturn(expression)}${parent(expression, ast)}${expression["value"]}(${evaluatedArguments(expression, ast)});
        }()`;
    } else {
        return `${parent(expression, ast)}${expression["value"]}(${functionArguments(expression, ast)})`;
    }
}

function callExpr(expression, ast) {
    return `    ${side(expression, ast)};`;
}

function constructor(expression, ast) {
    if (requiresStrictEvaluationOrder(expression, ast)) {
        return constructorStrict(expression, ast);
    } else {
        return constructorRegular(expression, ast);
    }
}

function constructorRegular(expression, ast) {
    if (ast[expression["value"]]["usedBeforeDefined"]) {
        return `std::make_unique<${expression["value"]}>(${functionArguments(expression, ast)})`;
    } else {
        return `${expression["value"]}{${functionArguments(expression, ast)}}`;
    }
}

function constructorStrict(expression, ast) {
    if (ast[expression["value"]]["usedBeforeDefined"]) {
        return `[${evaluatedArgumentsDeclarations(expression, ast)}]() mutable { 
            return std::make_unique<${expression["value"]}>(${evaluatedArguments(expression, ast)});
        }()`;
    } else {
        return `[${evaluatedArgumentsDeclarations(expression, ast)}]() mutable {
            return ${expression["value"]}{${evaluatedArguments(expression, ast)}};
        }()`;
    }
}

function elseExpr(expression, ast) {
    return `    else {
        ${generate(expression["body"][0], ast)}
    }`;
}

function evaluatedArguments(expression, ast) {
    let args = [];
    let counter = 1;

    for (const arg of expression["arguments"]) {
        if (isCall(arg)) {
            args.push(`std::move(arg${counter++})`);
        } else {
            args.push(side(arg, ast));
        }
    }

    return args.join(",");
}

function evaluatedArgumentsDeclarations(expression, ast) {
    let declarations = ["&"];
    let counter = 1;

    for (const arg of expression["arguments"]) {
        if (isCall(arg)) {
            declarations.push(`arg${counter++} = ${side(arg, ast)}`);
        }
    }

    return declarations.join(", ");
}

function evaluatedArgumentsList(expression, ast) {
    let args = [];

    for (const arg of expression["arguments"]) {
        if (isCall(arg)) {
            args.push(`std::move(${cpptypes.variableName(ast[arg["value"]]["returnValue"])}_)`);
        } else {
            args.push(side(arg, ast));
        }
    }

    return args;
}

function expressionType(expression) {
    if ("returnType" in expression) {
        return expression["returnType"];
    } else {
        return expression["type"];
    }
}

function field(expression, ast) {
    return `${parent(expression, ast)}${cpptypes.variableName(expression["value"])}()`;
}

function forExpr(expression, ast) {
    return `    for (Int64 i_ = 0; i_ < ${side(expression["iterations"], ast)}; i_++) {
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
    return `    ${elseif}if (${side(expression["condition"]["left"], ast)} ${expression["condition"]["type"]} ${side(expression["condition"]["right"], ast)}) {
    ${generate(expression["body"][0], ast)}
    }`;
}

function isCall(arg) {
    return ["call", "method", "constructor"].includes(arg["type"]);
}

function hasOutArguments(type, ast) {
    for (const arg of ast[type]["arguments"]) {
        if (arg["out"]) {
            return true;
        }
    }

    return false;
}

function method(expression, ast) {
    switch (expression["value"]) {
        case "index":
            return `static_cast<Byte>(${parent(expression, ast)}${expression["value"]}(${functionArguments(expression, ast)}))`;
        case "at":
            return `${parent(expression, ast)}${expression["value"]}(static_cast<size_t>(${functionArguments(expression, ast)}))`;
        default:
            return call(expression, ast);
    }
}

function newVariable(expression, ast) {
    if ("returnType" in expression) {
        return `{}`;
    } else {
        return `${cpptypes.variableDeclaration(expression["value"], ast)}`;
    }
}

function parent(expression, ast) {
    if (expression["parent"]) {
        return `${side(expression["parent"], ast)}${parentAccessor(expression, ast)}`;
    } else {
        return "";
    }
}

function parentAccessor(expression, ast) {
    const type = expression["parent"]["value"];

    if (type in ast && ast[type]["usedBeforeDefined"]) {
        return "->";
    } else {
        return ".";
    }
}

function requiresStrictEvaluationOrder(expression, ast) {
    for (const arg of expression["arguments"]) {
        if (arg["value"] in ast && isCall(arg) && ast[arg["value"]]["arguments"].length > 1 && hasOutArguments(arg["value"], ast)) {
            return true;
        }
    }

    return false;
}

function returnExpr(expression, ast) {
    return `    return ${side(expression, ast)};`;
}

function side(expression, ast) {
    switch (expressionType(expression)) {
        case "variant":
            return variant(expression, ast);
        case "call":
            return call(expression, ast);
        case "method":
            return method(expression, ast);
        case "constructor":
            return constructor(expression, ast);
        case "number":
            return expression["value"];
        case "new":
            return newVariable(expression, ast);
        case "field":
            return field(expression, ast);
        default:
            return cpptypes.variableName(expression["value"]);
    }
}

function strictCallReturn(expression) {
    if (expression["realType"]) {
        return "return ";
    } else {
        return "";
    }
}

function variant(expression, ast) {
    return `std::get<${cpptypes.cppType(expression["value"], ast)}>(${side(expression["parent"], ast)})`;
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
