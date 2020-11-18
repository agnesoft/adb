import { jsType } from "./parser_common.js";

function validateArrayType(token, type) {
    if (jsType(type) != "string") {
        throw `Parser: type of array '${token}' invalid ('${jsType(
            type
        )}', must be 'string').`;
    }

    if (!type) {
        throw `Parser: type of array '${token}' cannot be empty.`;
    }
}

function arrayType(token, schema) {
    validateArrayType(token, schema[token][0]);
    return schema[token][0];
}

export function arrayAST(token, schema) {
    return {
        type: "array",
        name: token,
        arrayType: arrayType(token, schema),
    };
}
