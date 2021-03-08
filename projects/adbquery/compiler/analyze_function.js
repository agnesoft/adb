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
    return (
        node["body"].length > 0 &&
        node["body"][node["body"].length - 1]["type"] == "return"
    );
}

function validateArguments(node, object, ast) {
    for (const arg of node["arguments"]) {
        if (!typeExists(arg["value"], ast)) {
            throw `Analyzer: the argument '${
                arg["value"]
            }' in function '${functionName(
                node,
                object
            )}' is not an existing type.`;
        }
    }
}

function validateElseIf(expr, hasIf, node, object) {
    if (!hasIf && (expr["type"] == "elseif" || expr["type"] == "else")) {
        throw `Analyzer: invalid expression in function '${functionName(
            node,
            object
        )}'. The 'else/if' must follow 'if' or 'else if'.`;
    }

    return ["if", "elseif"].includes(expr["type"]);
}

function validateIf(node, object) {
    let hasIf = false;

    for (const expr of node["body"]) {
        hasIf = validateElseIf(expr, hasIf, node, object);
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
    validateIf(node, object);
    validateReturn(node, object, ast);
    analyzeExpressions(node, object, ast);
    return ast;
}
