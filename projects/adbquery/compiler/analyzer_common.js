export function isNative(type) {
    return ["byte", "double", "int64", "string"].includes(type);
}

export function typeExists(type, ast) {
    return type && (isNative(type) || type in ast);
}

export function realType(type, ast) {
    if (!isNaN(type)) {
        return "int64";
    }

    if (isNative(type)) {
        return type;
    }

    if (!type || !(type in ast)) {
        return undefined;
    }

    if (ast[type]["type"] == "alias") {
        return realType(ast[type]["aliasedType"], ast);
    }

    return type;
}

export function astType(type, ast) {
    if (!isNaN(type)) {
        return "number";
    }

    if (isNative(type)) {
        return "native";
    }

    if (!type || !(type in ast)) {
        return undefined;
    }

    return ast[type]["type"];
}
