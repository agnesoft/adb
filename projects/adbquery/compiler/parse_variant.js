import { jsType } from "./parser_common.js";

function validateVariants(token, variants) {
    if (variants.length == 0) {
        throw `Parser: list of variants of '${token}' cannot be empty.`;
    }

    for (const variant of variants) {
        if (jsType(variant) != "string") {
            throw `Parser: variant of '${token}' invalid ('${jsType(
                variant
            )}', must be 'string').`;
        }

        if (!variant) {
            throw `Parser: variant of '${token}' cannot be empty.`;
        }
    }
}

function variants(token, schema) {
    validateVariants(token, schema[token]);
    return schema[token];
}

export function variantAST(token, schema) {
    return {
        type: "variant",
        name: token,
        variants: variants(token, schema),
    };
}
