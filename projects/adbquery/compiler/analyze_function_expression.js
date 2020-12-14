import { realType, typeType as astType } from "./analyzer_common.js";

function isArgument(type, node) {
    return node["arguments"].includes(type);
}

function isArrayType(type, context) {
    return context["type"] == "array" && context["arrayType"] == type;
}

function isField(type, context, ast) {
    return (
        context["type"] == "object" &&
        (context["fields"].includes(type) || isParentField(type, context, ast))
    );
}

function isParentField(type, context, ast) {
    return context["base"] && isField(type, ast[context["base"]], ast);
}

function isVariant(type, context) {
    return context["type"] == "variant" && context["variants"].includes(type);
}

function expressionType(expression, node, context, ast) {
    if (context) {
        if (isField(expression["value"], context, ast)) {
            return "field";
        }

        if (isArrayType(expression["value"], context)) {
            return "arrayType";
        }

        if (isVariant(expression["value"], context)) {
            return "variant";
        }
    }

    if (!expression["parent"]) {
        if (isArgument(expression["value"], node)) {
            return "argument";
        }

        if (!isNaN(expression["value"])) {
            return "number";
        }

        return "new";
    }

    throw `The '${expression["value"]}' cannot be accessed via '${expression["parent"]["value"]}'.`;
}

function expressionContext(expression, object, ast) {
    const parent = expression["parent"];

    if (parent) {
        return ast[parent["value"]];
    }

    return object;
}

function analyzeExpressionPart(expression, node, object, ast) {
    const context = expressionContext(expression, object, ast);

    if (expression["parent"]) {
        analyzeExpressionPart(expression["parent"], node, object, ast);
    }

    expression["type"] = expressionType(expression, node, context, ast);
}

function analyzeReturn(expression, node, object, ast) {
    const context = expressionContext(expression, object, ast);

    if (expression["parent"]) {
        analyzeExpressionPart(expression["parent"], node, object, ast);
    }

    if (expression["returnType"] != "call") {
        expression["returnType"] = expressionType(
            expression,
            node,
            context,
            ast
        );
    }
}

function isRightVariantOfLeft(left, right, ast) {
    return (
        ast[left] &&
        "variants" in ast[left] &&
        ast[left]["variants"].includes(right)
    );
}

function isRightArrayTypeOfLeft(left, right, ast) {
    return (
        ast[left] &&
        ast[left]["type"] == "array" &&
        ast[left]["arrayType"] == right
    );
}

function validateAssignment(expression, ast) {
    const leftRealType = realType(expression["left"]["value"], ast);
    const leftASTType = astType(leftRealType, ast);
    const rightRealType = realType(expression["right"]["value"], ast);
    const rightType = astType(rightRealType, ast);

    if (leftRealType == rightRealType) {
        return;
    }

    if (leftASTType == "native" && leftASTType == rightType) {
        return;
    }

    if (isRightVariantOfLeft(leftRealType, rightRealType, ast)) {
        return;
    }

    throw `Cannot assign '${expression["right"]["value"]}' (${rightType}) to '${expression["left"]["value"]}' (${leftASTType}).`;
}

function validateAddition(expression, ast) {
    const leftRealType = realType(expression["left"]["value"], ast);
    const leftASTType = astType(leftRealType, ast);
    const rightRealType = realType(expression["right"]["value"], ast);
    const rightType = astType(rightRealType, ast);

    if (leftRealType == rightRealType) {
        return;
    }

    if (leftASTType == "native" && leftASTType == rightType) {
        return;
    }

    if (isRightArrayTypeOfLeft(leftRealType, rightRealType, ast)) {
        return;
    }

    throw `Cannot add '${expression["right"]["value"]}' (${rightType}) to '${expression["left"]["value"]}' (${leftASTType}).`;
}

function analyzeAssignment(expression, node, object, ast) {
    validateAssignment(expression, ast);
    analyzeExpressionPart(expression["left"], node, object, ast);
    analyzeExpressionPart(expression["right"], node, object, ast);
}

function analyzeAddition(expression, node, object, ast) {
    validateAddition(expression, ast);
    analyzeExpressionPart(expression["left"], node, object, ast);
    analyzeExpressionPart(expression["right"], node, object, ast);
}

function analyzeCall(expression, node, object, ast) {
    throw "Not implemented";
}

export function analyzeExpression(expression, node, object, ast) {
    switch (expression["type"]) {
        case "assignment":
            analyzeAssignment(expression, node, object, ast);
            break;
        case "call":
            analyzeCall(expression, node, object, ast);
            break;
        case "addition":
            analyzeAddition(expression, node, object, ast);
            break;
        case "return":
            analyzeReturn(expression, node, object, ast);
            break;
        default:
            throw `Unknown expression type '${expression["type"]}'.`;
    }
}
