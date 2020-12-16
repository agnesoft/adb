import { realType, typeExists, astType } from "./analyzer_common.js";

function addCallTypes(expression, func) {
    expression["realType"] = realType(func["returnValue"], ast);
    expression["astType"] = astType(expression["realType"], ast);
}

function analyzeAddition(expression, context, ast) {
    analyzeSide(expression["left"], context, ast);
    analyzeSide(expression["right"], context, ast);
    validateAddition(expression, ast);
}

function analyzeConstructorArguments(expression, context, ast) {}

function analyzeFunctionArguments(expression, func, context, ast) {}

function analyzeAssignment(expression, context, ast) {
    analyzeSide(expression["left"], context, ast);
    analyzeSide(expression["right"], context, ast);
    validateAssignment(expression, ast);
}

function analyzeCall(expression, context, ast) {
    if (hasParent(expression)) {
        analyzeCallWithParent(expression, context, ast);
    } else if (isFunction(expression, ast)) {
        analyzeFunctionCall(expression, context, ast);
    } else if (isMethod(expression, context)) {
        analyzeMethodCall(expression, context, ast);
    } else if (isConstructor(expression, ast)) {
        analyzeConstructorCall(expression, context, ast);
    }

    throw `Cannot call '${expression["value"]}' (not a function).`;
}

function analyzeCallWithParent(expression, context, ast) {
    if (isParentMethod(expression, ast)) {
        let func =
            ast[expression["parent"]["realType"]]["functions"][
                expression["value"]
            ];
        addCallTypes(expression, func);
        analyzeFunctionArguments(expression, func, context, ast);
        expression["type"] = "method";
    }

    throw `Cannot call '${
        expression["value"]
    }' (not a function) on '${expressionAsString(expression["parent"])}'.`;
}

function analyzeConstructorCall(expression, context, ast) {
    expression["realType"] = realType(expression["value"], ast);
    expression["astType"] = astType(expression["realType"], ast);
    analyzeConstructorArguments(expression, context, ast);
    expression["type"] = "constructor";
}

function analyzeFunctionCall(expression, context, ast) {
    let func = ast[expression["value"]];
    addCallTypes(expression, func);
    analyzeFunctionArguments(expression, func, context, ast);
}

function analyzeMethodCall(expression, context, ast) {
    let func = context["object"]["functions"][expression["value"]];
    addCallTypes(expression, func);
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
}

function analyzeSide(expression, context, ast) {
    analyzeParent(expression, context, ast);

    if (expression["type"] == "call") {
        analyzeCall(expression, context, ast);
    } else {
        analyzeType(expression, context, ast);
    }
}

function analyzeType(expression, context, ast) {
    validateType(expression["value"], ast);
    expression["realType"] = realType(expression["value"], ast);
    expression["astType"] = astType(expression["realTtype"], ast);
    expression["type"] = expressionType(expression, context, ast);
}

function expressionType(expression, context, ast) {
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
        expression["value"] in context["object"]["fields"] ||
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
    return isFunction(expression, context);
}

function isLocal(expression, context) {
    return expression["value"] in context["locals"];
}

function isNumber(expression) {
    return expression["astType"] == "number";
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
        isParentObject(expression) &&
        expression["value"] in
            ast[expression["parent"]["realType"]]["functions"]
    );
}

function isVariant(type, ast) {
    return type in ast && ast[type]["variant"] == "variant";
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

function validateAddition(expression, ast) {
    const leftType = expression["left"]["realType"];
    const rightType = expression["right"]["realType"];

    if (
        leftType == rightType ||
        (isNumber(expression["left"]) && isNumber(expression["right"])) ||
        isArrayType(leftType, rightType, ast)
    ) {
        return;
    }

    throw `Cannot add ${expressionAsString(
        expression["right"]
    )} to ${expressionAsString(expression["left"])}.`;
}

function validateAssignment(expression, ast) {
    const leftType = expression["left"]["realType"];
    const rightType = expression["right"]["realType"];

    if (
        leftType == rightType ||
        (isNumber(expression["left"]) && isNumber(expression["right"])) ||
        isVariantType(leftType, rightType, ast)
    ) {
        return;
    }

    throw `Cannot assign ${expressionAsString(
        expression["right"]
    )} to ${expressionAsString(expression["left"])}.`;
}

function validateType(type, ast) {
    if (!typeExists(type, ast)) {
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
        case "return":
            analyzeReturn(expression, context, ast);
            break;
        default:
            throw `Unknown expression type '${expression["type"]}'.`;
    }
}
