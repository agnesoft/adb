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

function analyzeFunctionArguments(expression, func, context, ast) {
    validateArgumentsLength(expression, func["arguments"]);
    analyzeArguments(expression, func["arguments"], context, ast);
}

function analyzeFunctionCall(expression, context, ast) {
    let func = ast[expression["value"]];
    addCallTypes(expression, func, ast);
    analyzeFunctionArguments(expression, func, context, ast);
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
    return isFunction(expression, context);
}

function isLiteralNumber(expression) {
    return !isNaN(expression["value"]);
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

function validateAddition(left, right, ast) {
    if (
        left["realType"] != right["realType"] &&
        !(isNumber(left) && isNumber(right)) &&
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
        !(isNumber(left) && isNumber(right)) &&
        !isVariantType(left["realType"], right["realType"], ast)
    ) {
        throw `Cannot assign ${expressionAsString(
            right
        )} to ${expressionAsString(left)}.`;
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
        case "return":
            analyzeReturn(expression, context, ast);
            break;
        default:
            throw `Unknown expression type '${expression["type"]}'.`;
    }
}
