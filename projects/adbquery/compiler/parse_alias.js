function validateAliasedType(token, type) {
    if (!type) {
        throw `Parser: type of alias '${token}' cannot be empty.`;
    }
}

function aliasedType(token, schema) {
    validateAliasedType(token, schema[token]);
    return schema[token];
}

export function aliasAST(token, schema) {
    return {
        type: "alias",
        name: token,
        aliasedType: aliasedType(token, schema),
    };
}
