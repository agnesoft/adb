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

import { expressionAST } from "./parse_function_expression.js";
import { jsType } from "./parser_common.js";

let FUNCTION_NAME = "";

function validateArgument(arg) {
    if (jsType(arg) != "string") {
        throw `Parser: argument in 'arguments' of '${FUNCTION_NAME}' invalid ('${jsType(arg)}', must be 'string').`;
    }

    if (!arg) {
        throw `Parser: argument in 'arguments' of '${FUNCTION_NAME}' cannot be empty.`;
    }
}

function validateArguments(args) {
    if (jsType(args) != "array") {
        throw `Parser: type of 'arguments' of '${FUNCTION_NAME}' invalid ('${jsType(args)}', must be 'array').`;
    }

    for (const argument of args) {
        validateArgument(argument);
    }
}

function functionArguments(func) {
    if ("arguments" in func) {
        validateArguments(func["arguments"]);

        let args = [];

        for (const arg of func["arguments"]) {
            args.push({ value: arg });
        }

        return args;
    }

    return [];
}

function validateExpression(expression) {
    if (jsType(expression) != "string") {
        throw `Parser: expression in 'body' of '${FUNCTION_NAME}' invalid ('${jsType(expression)}', must be 'string').`;
    }

    if (!expression) {
        throw `Parser: expression in 'body' of '${FUNCTION_NAME}' cannot be empty.`;
    }
}

function validateBody(body) {
    if (jsType(body) != "array") {
        throw `Parser: type of 'body' of '${FUNCTION_NAME}' invalid ('${jsType(body)}', must be 'array').`;
    }
}

function functionBody(func) {
    let expressions = [];

    if ("body" in func) {
        validateBody(func["body"]);

        for (const expression of func["body"]) {
            validateExpression(expression);
            expressions.push(expressionAST(FUNCTION_NAME, expression.trim()));
        }
    }

    return expressions;
}

function validateReturn(returnValue) {
    if (jsType(returnValue) != "string") {
        throw `Parser: type of 'return' of '${FUNCTION_NAME}' invalid ('${jsType(returnValue)}', must be 'string').`;
    }

    if (!returnValue) {
        throw `Parser: 'return' of '${FUNCTION_NAME}' cannot be empty.`;
    }
}

function functionReturn(func) {
    if ("return" in func) {
        validateReturn(func["return"]);
        return func["return"];
    }

    return undefined;
}

export function isFunction(token, schema) {
    const keys = Object.keys(schema[token]);
    return ["arguments", "body", "return"].some((element) => keys.includes(element));
}

export function functionAST(name, func, objectName = undefined) {
    FUNCTION_NAME = objectName ? `${objectName}::${name}` : name;

    return {
        type: "function",
        name: name,
        arguments: functionArguments(func),
        body: functionBody(func),
        returnValue: functionReturn(func),
    };
}
