import { typeExists } from "./analyzer_common.js";
import { analyzeFunction } from "./analyze_function.js";

function validateFieldTypeExists(field, node, ast) {
    if (!typeExists(field, ast)) {
        throw `Analyzer: the field '${field}' of object '${node["name"]}' is not an existing type.`;
    }
}

function validateField(field, node, ast) {
    validateFieldTypeExists(field, node, ast);
}

function validateFields(node, ast) {
    for (const field of node["fields"]) {
        validateField(field, node, ast);
    }
}

function analyzeFunctions(node, ast) {
    for (const func in node["functions"]) {
        analyzeFunction(node["functions"][func], node, ast);
    }
}

export function analyzeObject(node, ast) {
    validateFields(node, ast);
    analyzeFunctions(node, ast);
}
