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

function isComma(token) {
    return isPunctuation(token) && token["value"] == ",";
}

function isEndBracket(token) {
    return isPunctuation(token) && token["value"] == ")";
}

function isPunctuation(token) {
    return token && token["type"] == "punctuation";
}

function isOperator(token) {
    return token && token["type"] == "operator";
}

function parseBody() {
    return [parseToken(tokenizer.next())];
}

function parseElse() {
    const token = tokenizer.peekNext();

    if (token["value"] == "if") {
        tokenizer.next();
        let ast = parseIf();
        ast["type"] = "elseif";
        return ast;
    } else {
        skipPunctuation("{");
        let ast = {
            type: "else",
            body: parseBody(),
        };
        skipPunctuation("}");
        return ast;
    }
}

function parseIf() {
    let ast = { type: "if" };
    skipPunctuation("(");
    ast["condition"] = parseIdentifier(tokenizer.next());
    skipPunctuation(")");
    skipPunctuation("{");
    ast["body"] = parseBody();
    skipPunctuation("}");
    return ast;
}

function parseFor() {
    let ast = { type: "for" };
    skipPunctuation("(");
    ast["iterations"] = parseIdentifier(tokenizer.next());
    skipPunctuation(")");
    skipPunctuation("{");
    ast["body"] = parseBody();
    skipPunctuation("}");
    return ast;
}

function parseReturn() {
    let ast = parseIdentifier(tokenizer.next());
    ast["returnType"] = ast["type"];
    ast["type"] = "return";
    return ast;
}

function parseCall(ast) {
    ast["arguments"] = parseCallArguments();
    return parseNext(ast);
}

function parseCallArguments() {
    let args = [];
    let token = tokenizer.next();

    while (true) {
        if (!token) {
            throw `Parser: unexpected end of data, expected an argument or ')' in '${FUNCTION_NAME}'.`;
        }

        if (isEndBracket(token)) {
            return args;
        }

        args.push(parseIdentifier(token));
        token = tokenizer.next();

        if (isComma(token)) {
            token = tokenizer.next();
        }
    }
}

function parsePunctuation(token, ast) {
    switch (token["value"]) {
        case ".":
            return parseIdentifier(tokenizer.next(), { parent: ast });
        case "(":
            ast["type"] = "call";
            return parseCall(ast);
        default:
            throw `Parser: expected '(' or '.', got '${token["value"]}' in '${FUNCTION_NAME}'.`;
    }
}

function parseOperator(token, ast) {
    return {
        type: token["value"],
        left: ast,
        right: parseIdentifier(tokenizer.next()),
    };
}

function parseNext(ast) {
    const next = tokenizer.peekNext();

    if (
        !next ||
        next["value"] == ")" ||
        next["value"] == "}" ||
        isComma(next)
    ) {
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
        throw `Parser: expected '(' or '.' or an operator, got '${token["value"]}' [${token["type"]}] in '${FUNCTION_NAME}'.`;
    }
}

function parseIdentifier(token, ast = {}) {
    validateIdentifier(token);
    ast["type"] = token["type"];
    ast["value"] = token["value"];
    return parseNext(ast);
}

function parseKeyword(token) {
    switch (token["value"]) {
        case "if":
            return parseIf();
        case "else":
            return parseElse();
        case "for":
            return parseFor();
        case "return":
            return parseReturn();
        default:
            throw `Parser: unknown keyword '${token["value"]}' in '${FUNCTION_NAME}'.`;
    }
}

function skipPunctuation(value) {
    const token = tokenizer.next();

    if (!(token["type"] == "punctuation" && token["value"] == value)) {
        throw `Parser: expected '${value}', got '${token["value"]}' [${token["type"]}] in '${FUNCTION_NAME}'.`;
    }
}

function validateIdentifier(token) {
    if (!token) {
        throw `Parser: expected an identifier, got nothing in '${FUNCTION_NAME}'.`;
    }

    if (!["number", "identifier"].includes(token["type"])) {
        throw `Parser: expected an identifier, got '${token["value"]}' [${token["type"]}] in '${FUNCTION_NAME}'.`;
    }
}

function parseToken(token) {
    switch (token["type"]) {
        case "keyword":
            return parseKeyword(token);
        case "identifier":
            return parseIdentifier(token);
        default:
            throw `Parser: invalid expression '${EXPRESSION}' in '${FUNCTION_NAME}'.`;
    }
}

export function expressionAST(name, expression) {
    EXPRESSION = expression;
    FUNCTION_NAME = name;
    tokenizer.setData(expression);
    return parseToken(tokenizer.next());
}
