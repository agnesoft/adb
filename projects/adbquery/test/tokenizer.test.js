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

import * as tokenizer from "../compiler/tokenizer.js";

describe("serializer", () => {
    describe("valid", () => {
        test("number", () => {
            tokenizer.setData("   123   ");

            expect(tokenizer.next()).toEqual({
                type: "number",
                value: 123,
            });
        });

        test("keyword", () => {
            tokenizer.setData("if (");

            expect(tokenizer.next()).toEqual({
                type: "keyword",
                value: "if",
            });
        });

        test("identifier", () => {
            tokenizer.setData("\nId");

            expect(tokenizer.next()).toEqual({
                type: "identifier",
                value: "Id",
            });
        });

        test("identifier with underscore", () => {
            tokenizer.setData("\nId_1");

            expect(tokenizer.next()).toEqual({
                type: "identifier",
                value: "Id_1",
            });
        });

        test("operator", () => {
            tokenizer.setData("+=1");

            expect(tokenizer.next()).toEqual({
                type: "operator",
                value: "+=",
            });
        });

        test("punctuation", () => {
            tokenizer.setData("(val");

            expect(tokenizer.next()).toEqual({
                type: "punctuation",
                value: "(",
            });
        });

        test("function name", () => {
            tokenizer.setData("foo()");

            expect(tokenizer.next()).toEqual({
                type: "identifier",
                value: "foo",
            });
        });

        test("function with arguments", () => {
            tokenizer.setData("foo(arg1, arg2)");
            let tokens = [];
            let token = undefined;

            while ((token = tokenizer.next())) {
                tokens.push(token);
            }

            const expected = [
                {
                    type: "identifier",
                    value: "foo",
                },
                {
                    type: "punctuation",
                    value: "(",
                },
                {
                    type: "identifier",
                    value: "arg1",
                },
                {
                    type: "punctuation",
                    value: ",",
                },
                {
                    type: "identifier",
                    value: "arg2",
                },
                {
                    type: "punctuation",
                    value: ")",
                },
            ];

            expect(tokens).toEqual(expected);
        });

        test("function with nested call", () => {
            tokenizer.setData("foo(arg1, bar())");
            let tokens = [];
            let token = undefined;

            while ((token = tokenizer.next())) {
                tokens.push(token);
            }

            const expected = [
                {
                    type: "identifier",
                    value: "foo",
                },
                {
                    type: "punctuation",
                    value: "(",
                },
                {
                    type: "identifier",
                    value: "arg1",
                },
                {
                    type: "punctuation",
                    value: ",",
                },
                {
                    type: "identifier",
                    value: "bar",
                },
                {
                    type: "punctuation",
                    value: "(",
                },
                {
                    type: "punctuation",
                    value: ")",
                },
                {
                    type: "punctuation",
                    value: ")",
                },
            ];

            expect(tokens).toEqual(expected);
        });

        test("peekNext()", () => {
            tokenizer.setData(")");

            expect(tokenizer.peekNext()).toEqual({
                type: "punctuation",
                value: ")",
            });

            expect(tokenizer.next()).toEqual({
                type: "punctuation",
                value: ")",
            });
        });
    });

    describe("invalid", () => {
        test("bad token at the start", () => {
            tokenizer.setData("~");

            expect(tokenizer.next).toThrow("Tokenizer: Cannot handle character '~'.");
        });

        test("bad token in the middle", () => {
            tokenizer.setData("foo~()");

            const next = () => {
                tokenizer.next();
                tokenizer.next();
            };

            expect(next).toThrow("Tokenizer: Cannot handle character '~'.");
        });

        test("bad number", () => {
            tokenizer.setData("123a");

            expect(tokenizer.next).toThrow("Tokenizer: '123a' is not a number.");
        });
    });
});
