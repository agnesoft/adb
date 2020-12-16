import { typeExists } from "./analyzer_common.js";
import { analyzeExpression } from "./analyze_function_expression.js";

function analyzeExpressions(node, object, ast) {
    let context = functionContext(node, object, ast);

    for (let expression of node["body"]) {
        try {
            analyzeExpression(expression, context, ast);
        } catch (e) {
            throw `Analyzer: invalid expression in function '${functionName(
                node,
                object
            )}'. ${e}`;
        }
    }
}

function functionContext(node, object) {
    return {
        func: node,
        object: object ? object : { fields: [], functions: {} },
        locals: [],
    };
}

function functionName(node, object) {
    if (object) {
        return `${object["name"]}::${node["name"]}`;
    }

    return `${node["name"]}`;
}

function hasReturnStatement(node) {
    for (const expression of node["body"]) {
        if (expression["type"] == "return") {
            return true;
        }
    }

    return false;
}

function validateArguments(node, object, ast) {
    for (const arg of node["arguments"]) {
        if (!typeExists(arg, ast)) {
            throw `Analyzer: the argument '${arg}' in function '${functionName(
                node,
                object
            )}' is not an existing type.`;
        }
    }
}

function validateReturn(node, object, ast) {
    if (node["returnValue"]) {
        if (!typeExists(node["returnValue"], ast)) {
            throw `Analyzer: the return type '${
                node["returnValue"]
            }' of function '${functionName(
                node,
                object
            )}' is not an existing type.`;
        }

        if (!hasReturnStatement(node)) {
            throw `Analyzer: missing return statement in function '${functionName(
                node,
                object
            )}' that has a return value.`;
        }
    }
}

export function analyzeFunction(node, object, ast) {
    validateArguments(node, object, ast);
    validateReturn(node, object, ast);
    analyzeExpressions(node, object, ast);
    return ast;
}
