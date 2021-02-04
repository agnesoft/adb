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

import { realType, typeExists, astType } from "./analyzer_common.js";

function addCallTypes(expression, func, ast) {
    expression["realType"] = realType(func["returnValue"], ast);
    expression["astType"] = astType(expression["realType"], ast);
}

function analyzeAddition(expression, context, ast) {
    analyzeSide(expression["left"], context, ast);
    analyzeSide(expression["right"], context, ast);
    validateAddition(expression["left"], expression["right"], ast);
}

function analyzeArgument(arg, expected, context, ast) {
    analyzeSide(arg, context, ast);
    validateAssignment(
        {
            value: expected,
            realType: realType(expected, ast),
            astType: astType(realType(expected, ast), ast),
        },
        arg,
        ast
    );
}

function analyzeArguments(expression, expected, context, ast) {
    for (let i = 0; i < expression["arguments"].length; i++) {
        analyzeArgument(expression["arguments"][i], expected[i], context, ast);
    }
}

function analyzeAssignment(expression, context, ast) {
    analyzeSide(expression["left"], context, ast);
    analyzeSide(expression["right"], context, ast);
    validateAssignment(expression["left"], expression["right"], ast);
}

function analyzeCall(expression, context, ast) {
    analyzeSide(expression, context, ast);
}

function analyzeCallExpression(expression, context, ast) {
    if (hasParent(expression)) {
        analyzeCallWithParent(expression, context, ast);
    } else if (isFunction(expression, ast)) {
        analyzeFunctionCall(expression, context, ast);
    } else if (isMethod(expression, context)) {
        analyzeMethodCall(expression, context, ast);
    } else if (isConstructor(expression, ast)) {
        analyzeConstructorCall(expression, context, ast);
    } else {
        throw `Cannot call '${expression["value"]}' (not a function).`;
    }
}

function analyzeCallWithParent(expression, context, ast) {
    if (isParentMethod(expression, ast)) {
        let func =
            ast[expression["parent"]["realType"]]["functions"][
                expression["value"]
            ];
        addCallTypes(expression, func, ast);
        analyzeFunctionArguments(expression, func, context, ast);
        expression["type"] = "method";
    } else {
        throw `Cannot call '${expression["value"]}' on ${expressionAsString(
            expression["parent"]
        )}.`;
    }
}

function analyzeConstructorArguments(expression, context, ast) {
    validateArgumentsLength(expression, ast[expression["realType"]]["fields"]);
    analyzeArguments(
        expression,
        ast[expression["realType"]]["fields"],
        context,
        ast
    );
}

function analyzeConstructorCall(expression, context, ast) {
    expression["realType"] = realType(expression["value"], ast);
    expression["astType"] = astType(expression["realType"], ast);
    analyzeConstructorArguments(expression, context, ast);
    expression["type"] = "constructor";
}

function analyzeBody(expression, context, ast) {
    for (let ifBodyExpression of expression["body"]) {
        analyzeExpression(ifBodyExpression, context, ast);
    }
}

function analyzeFor(expression, context, ast) {
    analyzeIterations(expression["iterations"], context, ast);
    context["locals"].push("i");
    analyzeBody(expression, context, ast);
}

function analyzeFunctionArguments(expression, func, context, ast) {
    validateArgumentsLength(expression, func["arguments"]);
    analyzeArguments(expression, func["arguments"], context, ast);
}

function analyzeFunctionCall(expression, context, ast) {
    let func = ast[expression["value"]];
    addCallTypes(expression, func, ast);
    analyzeFunctionArguments(expression, func, context, ast);
}

function analyzeIf(expression, context, ast) {
    analyzeSide(expression["left"], context, ast);
    analyzeSide(expression["right"], context, ast);
    analyzeBody(expression, context, ast);
    validateComparison(expression["left"], expression["right"]);
}

function analyzeIterations(iterations, context, ast) {
    analyzeSide(iterations, context, ast);
    validateIterations(iterations, ast);
}

function analyzeMethodCall(expression, context, ast) {
    let func = context["object"]["functions"][expression["value"]];
    addCallTypes(expression, func, ast);
    analyzeFunctionArguments(expression, func, context, ast);
    expression["type"] = "method";
}

function analyzeParent(expression, context, ast) {
    if (hasParent(expression)) {
        analyzeSide(expression["parent"], context, ast);
    }
}

function analyzeReturn(expression, context, ast) {
    expression["type"] = expression["returnType"];
    analyzeSide(expression, context, ast);
    expression["returnType"] = expression["type"];
    expression["type"] = "return";
    validateAssignment(
        {
            value: context["func"]["returnValue"],
            realType: realType(context["func"]["returnValue"], ast),
            astType: astType(
                realType(context["func"]["returnValue"], ast),
                ast
            ),
        },
        expression,
        ast
    );
}

function analyzeSide(expression, context, ast) {
    analyzeParent(expression, context, ast);

    if (expression["type"] == "call") {
        analyzeCallExpression(expression, context, ast);
    } else {
        analyzeTypeExpression(expression, context, ast);
    }
}

function analyzeTypeExpression(expression, context, ast) {
    validateType(expression["value"], ast);
    expression["realType"] = realType(expression["value"], ast);
    expression["astType"] = astType(expression["realType"], ast);
    expression["type"] = expressionType(expression, context, ast);
}

function expressionType(expression, context, ast) {
    if (isLiteralNumber(expression)) {
        return "number";
    }

    if (isArgument(expression, context)) {
        return "argument";
    }

    if (isField(expression, context, ast)) {
        return "field";
    }

    if (isLocal(expression, context)) {
        return "local";
    }

    if (isParentVariant(expression, ast)) {
        return "variant";
    }

    if (!hasParent(expression)) {
        context["locals"].push(expression["value"]);
        return "new";
    } else {
        throw `Invalid parent '${expression["parent"]["value"]}' (aka ${expression["parent"]["realType"]} [${expression["parent"]["astType"]}]) of '${expression["value"]}' (aka ${expression["realType"]} [${expression["astType"]}]).`;
    }
}

function isArgument(expression, context) {
    return context["func"]["arguments"].includes(expression["value"]);
}

function isArray(type, ast) {
    return type in ast && ast[type]["type"] == "array";
}

function isArrayType(arrayType, type, ast) {
    return (
        isArray(arrayType, ast) && realType(ast[arrayType]["arrayType"]) == type
    );
}

function isConstructor(expression, ast) {
    return (
        expression["value"] in ast &&
        ast[expression["value"]]["type"] == "object"
    );
}

function isField(expression, context, ast) {
    return (
        context["object"]["fields"].includes(expression["value"]) ||
        isParentField(expression, ast)
    );
}

function isFunction(expression, ast) {
    return (
        expression["value"] in ast &&
        ast[expression["value"]]["type"] == "function"
    );
}

function isMethod(expression, context) {
    return isFunction(expression, context["object"]["functions"]);
}

function isLiteralNumber(expression) {
    return !isNaN(expression["value"]);
}

function isLocal(expression, context) {
    return context["locals"].includes(expression["value"]);
}

function isParentArray(expression) {
    return expression["parent"]["astType"] == "array";
}

function isParentField(expression, ast) {
    return (
        hasParent(expression) &&
        isParentObject(expression) &&
        ast[expression["parent"]["realType"]]["fields"].includes(
            expression["value"]
        )
    );
}

function isParentObject(expression) {
    return expression["parent"]["astType"] == "object";
}

function isParentMethod(expression, ast) {
    return (
        (isParentArray(expression) || isParentObject(expression)) &&
        expression["value"] in
            ast[expression["parent"]["realType"]]["functions"]
    );
}

function isVariant(type, ast) {
    return type in ast && ast[type]["type"] == "variant";
}

function isParentVariant(expression, ast) {
    return (
        hasParent(expression) &&
        isVariantType(
            expression["parent"]["realType"],
            expression["value"],
            ast
        )
    );
}

function isVariantType(variantType, type, ast) {
    if (isVariant(variantType, ast)) {
        for (const variant of ast[variantType]["variants"]) {
            if (realType(variant, ast) == type) {
                return true;
            }
        }
    }

    return false;
}

function hasParent(expression) {
    return "parent" in expression;
}

function expressionAsString(expression) {
    return `'${expression["value"]}' (aka ${expression["realType"]} [${expression["astType"]}])`;
}

function isNumeric(left, right) {
    return left["realType"] == "int64" && right["type"] == "number";
}

function validateAddition(left, right, ast) {
    if (
        left["realType"] != right["realType"] &&
        !isNumeric(left, right) &&
        !isArrayType(left["realType"], right["realType"], ast)
    ) {
        throw `Cannot add ${expressionAsString(right)} to ${expressionAsString(
            left
        )}.`;
    }
}

function validateArgumentsLength(expression, args) {
    if (expression["arguments"].length != args.length) {
        throw `Incorrect number of arguments in call to '${expression["value"]}' (expected ${args.length}, got ${expression["arguments"].length}).`;
    }
}

function validateAssignment(left, right, ast) {
    if (
        left["realType"] != right["realType"] &&
        !isNumeric(left, right) &&
        !isVariantType(left["realType"], right["realType"], ast)
    ) {
        throw `Cannot assign ${expressionAsString(
            right
        )} to ${expressionAsString(left)}.`;
    }
}

function validateComparison(left, right) {
    if (left["realType"] != right["realType"]) {
        throw `Cannot compare ${expressionAsString(
            left
        )} and ${expressionAsString(right)}.`;
    }
}

function validateIterations(iterations, ast) {
    if (iterations["realType"] != "int64") {
        throw `The 'for' iterations' type must be an 'int64', got '${iterations["realType"]}'.`;
    }
}

function validateType(type, ast) {
    if (!astType(type, ast)) {
        throw `Unknown type '${type}'.`;
    }
}

export function analyzeExpression(expression, context, ast) {
    switch (expression["type"]) {
        case "addition":
            analyzeAddition(expression, context, ast);
            break;
        case "assignment":
            analyzeAssignment(expression, context, ast);
            break;
        case "call":
            analyzeCall(expression, context, ast);
            break;
        case "else":
            analyzeBody(expression, context, ast);
            break;
        case "elseif":
            analyzeIf(expression, context, ast);
            break;
        case "for":
            analyzeFor(expression, context, ast);
            break;
        case "if":
            analyzeIf(expression, context, ast);
            break;
        case "return":
            analyzeReturn(expression, context, ast);
            break;
        default:
            throw `Unknown expression type '${expression["type"]}'.`;
    }
}
