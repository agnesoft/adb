import { expressionAST } from "./parse_expression.js";
import { jsType } from "./parser_common.js";

function validateArgument(name, arg) {
    if (jsType(arg) != "string") {
        throw `Parser: argument in 'arguments' of '${name}' invalid ('${jsType(
            arg
        )}', must be 'string').`;
    }

    if (!arg) {
        throw `Parser: argument in 'arguments' of '${name}' cannot be empty.`;
    }
}

function validateArguments(name, args) {
    if (jsType(args) != "array") {
        throw `Parser: type of 'arguments' of '${name}' invalid ('${jsType(
            args
        )}', must be 'array').`;
    }

    for (const argument of args) {
        validateArgument(name, argument);
    }
}

function functionArguments(name, func) {
    if ("arguments" in func) {
        validateArguments(name, func["arguments"]);
        return func["arguments"];
    }

    return [];
}

function validateExpression(name, expression) {
    if (jsType(expression) != "string") {
        throw `Parser: expression in 'body' of '${name}' invalid ('${jsType(
            expression
        )}', must be 'string').`;
    }

    if (!expression) {
        throw `Parser: expression in 'body' of '${name}' cannot be empty.`;
    }
}

function validateBody(name, body) {
    if (jsType(body) != "array") {
        throw `Parser: type of 'body' of '${name}' invalid ('${jsType(
            body
        )}', must be 'array').`;
    }
}

function functionBody(name, func) {
    let expressions = [];

    if ("body" in func) {
        validateBody(name, func["body"]);

        for (const expression of func["body"]) {
            validateExpression(name, expression);
            expressions.push(expressionAST(expression.trim()));
        }
    }

    return expressions;
}

function validateReturn(name, returnValue) {
    if (jsType(returnValue) != "string") {
        throw `Parser: type of 'return' of '${name}' invalid ('${jsType(
            returnValue
        )}', must be 'string').`;
    }

    if (!returnValue) {
        throw `Parser: 'return' of '${name}' cannot be empty.`;
    }
}

function functionReturn(name, func) {
    if ("return" in func) {
        validateReturn(name, func["return"]);
        return func["return"];
    }

    return undefined;
}

export function isFunction(token, schema) {
    const keys = Object.keys(schema[token]);
    const test = (element) => keys.includes(element);
    return ["arguments", "body", "return"].some(test);
}

export function functionAST(name, func) {
    return {
        type: "function",
        name: name,
        arguments: functionArguments(name, func),
        body: functionBody(name, func),
        returnValue: functionReturn(name, func),
    };
}
