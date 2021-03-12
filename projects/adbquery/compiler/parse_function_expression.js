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

import * as tokenizer from "./tokenizer.js";

let FUNCTION_NAME = "";
let EXPRESSION = "";

function error(message) {
    throw `Parser: ${message} in function '${FUNCTION_NAME}' when parsing expression '${EXPRESSION}'.`;
}

function isComma(token) {
    return isPunctuation(token) && token["value"] == ",";
}

function isEndBracket(token) {
    validateToken(token);
    return isPunctuation(token) && token["value"] == ")";
}

function isExpressionEnd(token) {
    return !token || token["value"] == ")" || token["value"] == "}" || isComma(token);
}

function isOperator(token) {
    return token && token["type"] == "operator";
}

function isPunctuation(token) {
    return token && token["type"] == "punctuation";
}

function parseBody() {
    skipPunctuation("{");
    const ast = [parseToken(tokenizer.next())];
    skipPunctuation("}");
    return ast;
}

function parseCall(ast) {
    ast["arguments"] = parseCallArguments();
    return parseNext(ast);
}

function nextArgument() {
    const token = tokenizer.next();

    if (isComma(token)) {
        return tokenizer.next();
    } else {
        return token;
    }
}

function parseCallArguments() {
    let args = [];
    let token = tokenizer.next();

    while (!isEndBracket(token)) {
        args.push(parseIdentifier(token));
        token = nextArgument();
    }

    return args;
}

function parseElseOrElseIf() {
    if (tokenizer.peekNext()["value"] == "if") {
        tokenizer.next();
        return parseIf("elseif");
    } else {
        return {
            type: "else",
            body: parseBody(),
        };
    }
}

function parseFor() {
    return {
        type: "for",
        iterations: parseSubExpression(),
        body: parseBody(),
    };
}

function parseIdentifier(token, ast = {}) {
    validateIdentifier(token);
    ast["type"] = token["type"];
    ast["value"] = token["value"];
    return parseNext(ast);
}

function parseIf(type = "if") {
    return {
        type: type,
        condition: parseSubExpression(),
        body: parseBody(),
    };
}

function parseKeyword(token) {
    switch (token["value"]) {
        case "if":
            return parseIf();
        case "else":
            return parseElseOrElseIf();
        case "for":
            return parseFor();
        case "return":
            return parseReturn();
        default:
            error(`unknown keyword '${token["value"]}'`);
    }
}

function parseNext(ast) {
    const next = tokenizer.peekNext();

    if (isExpressionEnd(next)) {
        return ast;
    } else {
        return parseNextToken(ast);
    }
}

function parseNextToken(ast) {
    const token = tokenizer.next();

    if (isPunctuation(token)) {
        return parsePunctuation(token, ast);
    } else if (isOperator(token)) {
        return parseOperator(token, ast);
    } else {
        error(`expected '(' or '.' or an operator, got '${token["value"]}' [${token["type"]}]`);
    }
}

function parseOperator(token, ast) {
    return {
        type: token["value"],
        left: ast,
        right: parseIdentifier(tokenizer.next()),
    };
}

function parsePunctuation(token, ast) {
    switch (token["value"]) {
        case ".":
            return parseIdentifier(tokenizer.next(), { parent: ast });
        case "(":
            ast["type"] = "call";
            return parseCall(ast);
        default:
            error(`expected '(' or '.', got '${token["value"]}'`);
    }
}

function parseReturn() {
    let ast = parseIdentifier(tokenizer.next());
    ast["returnType"] = ast["type"];
    ast["type"] = "return";
    return ast;
}

function parseToken(token) {
    switch (token["type"]) {
        case "keyword":
            return parseKeyword(token);
        case "identifier":
            return parseIdentifier(token);
        default:
            error(`invalid expression`);
    }
}

function parseSubExpression() {
    skipPunctuation("(");
    const ast = parseIdentifier(tokenizer.next());
    skipPunctuation(")");
    return ast;
}

function skipPunctuation(value) {
    const token = tokenizer.next();

    if (!(token["type"] == "punctuation" && token["value"] == value)) {
        error(`expected '${value}', got '${token["value"]}' [${token["type"]}]`);
    }
}

function validateIdentifier(token) {
    if (!token) {
        error(`expected an identifier, got nothing`);
    }

    if (!["number", "identifier"].includes(token["type"])) {
        error(`expected an identifier, got '${token["value"]}' [${token["type"]}]`);
    }
}

function validateToken(token) {
    if (!token) {
        error(`unexpected end of data, expected an identifier or ')'`);
    }
}

export function expressionAST(name, expression) {
    EXPRESSION = expression;
    FUNCTION_NAME = name;
    tokenizer.setData(expression);
    return parseToken(tokenizer.next());
}
