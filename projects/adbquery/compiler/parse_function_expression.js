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

let FUNCTION_NAME = "";

function additionAST(expression) {
    const sides = expression.split("+=");

    return {
        type: "addition",
        left: sideAST(sides[0].trim()),
        right: sideAST(sides[1].trim()),
    };
}

function assignmentAST(expression) {
    const sides = expression.split("=");

    return {
        type: "assignment",
        left: sideAST(sides[0].trim()),
        right: sideAST(sides[1].trim()),
    };
}

function callArguments(part) {
    let args = [];
    part.slice(part.indexOf("(") + 1, part.length - 1)
        .split(",")
        .forEach((arg) => {
            if (arg.trim()) {
                args.push({
                    type: "argument",
                    value: arg.trim(),
                });
            }
        });
    return args;
}

function callAST(part) {
    return {
        type: "call",
        value: callName(part),
        arguments: callArguments(part),
    };
}

function callName(part) {
    validateCallName(part);
    return part.split("(")[0];
}

function expressionType(part) {
    if (isNaN(part)) {
        return "type";
    } else {
        return "number";
    }
}

function expressionASTBuilder(part, current) {
    part["parent"] = partAST(current.trim());
    return part["parent"];
}

function expressionValue(part) {
    validateType(part);

    if (isNaN(part)) {
        return part;
    } else {
        return Number(part);
    }
}

function functionCallAST(expression) {
    return sideAST(expression);
}

function partAST(part) {
    if (part.includes("(")) {
        return callAST(part);
    } else {
        return typeAST(part);
    }
}

function returnAST(expression) {
    const returnExpression = expression.slice(6);
    validateReturnType(returnExpression);
    let ast = sideAST(returnExpression);
    ast["returnType"] = ast["type"];
    ast["type"] = "return";
    return ast;
}

function sideAST(side) {
    let ast = {};
    const parts = side.split(".");
    parts.reduceRight(expressionASTBuilder, ast);
    return ast["parent"];
}

function typeAST(part) {
    return {
        type: expressionType(part),
        value: expressionValue(part),
    };
}

function validateCallName(part) {
    if (part.startsWith("(")) {
        throw `Parser: function name in function call in '${FUNCTION_NAME}' cannot be empty.`;
    }
}

function validateReturnType(part) {
    if (!part) {
        throw `Parser: return type in expression in function '${FUNCTION_NAME}' cannot be empty.`;
    }
}

function validateType(part) {
    if (!part) {
        throw `Parser: type name in expression in function '${FUNCTION_NAME}' cannot be empty.`;
    }
}

export function expressionAST(name, expression) {
    FUNCTION_NAME = name;

    if (expression.includes("+=")) {
        return additionAST(expression);
    }

    if (expression.includes("=")) {
        return assignmentAST(expression);
    }

    if (expression.startsWith("return")) {
        return returnAST(expression);
    }

    if (expression.endsWith(")")) {
        return functionCallAST(expression);
    }

    throw `Parser: unknown expression '${expression}' in '${FUNCTION_NAME}'.`;
}
