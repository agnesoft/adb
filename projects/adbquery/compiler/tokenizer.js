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

let pos = 0;
let data = "";

function get() {
    return data.charAt(pos++);
}

function identifierType(value) {
    return ["if", "else", "for", "return", "true", "false"].includes(value)
        ? "keyword"
        : "identifier";
}

function isAlphaNumeric(c) {
    return /[a-zA-Z\d]/.test(c);
}

function isCharacter(c) {
    return /[a-zA-Z]/.test(c);
}

function isInteger(c) {
    return /[\d]/.test(c);
}

function isOperator(c) {
    return /[!+=<>]/.test(c);
}

function isPunctuation(c) {
    return /[().,{}]/.test(c);
}

function isWhitespace(c) {
    return /\s/.test(c);
}

function hasNext() {
    return pos < data.length;
}

function peek() {
    return data.charAt(pos);
}

function readIdentifier() {
    const value = readWord(isAlphaNumeric);

    return {
        type: identifierType(value),
        value: value,
    };
}

function readNumber() {
    const number = readWord(isAlphaNumeric);
    validateNumber(number);

    return {
        type: "number",
        value: Number(number),
    };
}

function readOperator() {
    return {
        type: "operator",
        value: readWord(isOperator),
    };
}

function readPunctuation() {
    return {
        type: "punctuation",
        value: get(),
    };
}

function readWord(test) {
    let word = "";

    do {
        word += get();
    } while (hasNext() && test(peek()));

    return word;
}

function validateNumber(num) {
    if (isNaN(num)) {
        throw `Tokenizer: '${num}' is not a number.`;
    }
}

export function setData(expressionData) {
    pos = 0;
    data = expressionData;
}

export function next() {
    while (hasNext()) {
        const c = peek();

        if (isWhitespace(c)) {
            pos++;
            continue;
        } else if (isInteger(c)) {
            return readNumber();
        } else if (isCharacter(c)) {
            return readIdentifier();
        } else if (isPunctuation(c)) {
            return readPunctuation();
        } else if (isOperator(c)) {
            return readOperator();
        } else {
            throw `Tokenizer: Cannot handle character '${c}'.`;
        }
    }

    return undefined;
}

export function peekNext() {
    const currentPos = pos;
    const token = next();
    pos = currentPos;
    return token;
}
