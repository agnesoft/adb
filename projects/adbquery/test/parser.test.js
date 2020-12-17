import * as parser from "../compiler/parser.js";

describe("parse", () => {
    test("invalid type", () => {
        const data = {
            Id: 10,
        };

        const parse = () => {
            parser.parse(data);
        };

        expect(parse).toThrow("Unknown token type 'number' of token 'Id'.");
    });
});
