function validateType(part) {
    if (!part) {
        throw `Parser: type name in expression in function '${functionName}' cannot be empty.`;
    }
}

function expressionType(part) {
    if (isNaN(part)) {
        return "type";
    } else {
        return "number";
    }
}

function expressionValue(part) {
    validateType(part);

    if (isNaN(part)) {
        return part;
    } else {
        return Number(part);
    }
}

function typeAST(part) {
    return {
        type: expressionType(part),
        value: expressionValue(part),
    };
}

function callName(part) {
    if (part.startsWith("(")) {
        throw `Parser: function name in function call in '${functionName}' cannot be empty.`;
    }

    return part.split("(")[0];
}

function callArguments(part) {
    const args = [];
    const callArgs = part
        .slice(part.indexOf("(") + 1, part.length - 1)
        .split(",");
    for (const arg of callArgs) {
        if (arg.trim()) {
            args.push(arg.trim());
        }
    }
    return args;
}

function partAST(part) {
    if (part.includes("(")) {
        return {
            type: "call",
            value: callName(part),
            arguments: callArguments(part),
        };
    }

    return typeAST(part);
}

function expressionASTBuilder(part, current) {
    part["parent"] = partAST(current.trim());
    return part["parent"];
}

function sideAST(side) {
    let ast = {};
    const parts = side.split(".");
    parts.reduceRight(expressionASTBuilder, ast);
    return ast["parent"];
}

function additionAST(expression) {
    const sides = expression.split("+=");

    return {
        type: "addition",
        left: sideAST(sides[0].trim()),
        right: sideAST(sides[1].trim()),
    };
}

function assignmentAST(expression) {
    const sides = expression.split("=");

    return {
        type: "assignment",
        left: sideAST(sides[0].trim()),
        right: sideAST(sides[1].trim()),
    };
}

function callAST(expression) {
    return sideAST(expression);
}

function returnAST(expression) {
    let ast = sideAST(expression.substr(7));
    ast["returnType"] = ast["type"];
    ast["type"] = "return";
    return ast;
}

let functionName = "";

export function expressionAST(name, expression) {
    functionName = name;

    if (expression.includes("+=")) {
        return additionAST(expression);
    }

    if (expression.includes("=")) {
        return assignmentAST(expression);
    }

    if (expression.endsWith(")")) {
        return callAST(expression);
    }

    if (expression.startsWith("return ")) {
        return returnAST(expression);
    }

    throw `Parser: unknown expression '${expression}' in '${functionName}'.`;
}
