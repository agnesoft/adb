import * as parser from "./parser.js";
import * as analyzer from "./analyzer.js";
import * as serializer from "./serializer.js";

export function compile(data) {
    let ast = parser.parse(data);
    analyzer.addContext(ast);
    serializer.addSerialization(ast);
    return ast;
}
