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

const a = {
    serializeArray: {
        type: "function",
        name: "serializeArray",
        arguments: ["array"],
        body: [
            {
                type: "assignment",
                left: {
                    type: "new",
                    value: "ByteArray",
                    realType: "ByteArray",
                    astType: "array",
                },
                right: {
                    type: "call",
                    value: "arraySize",
                    arguments: ["array"],
                    realType: "int64",
                    astType: "native",
                },
            },
            {
                type: "return",
                value: "ByteArray",
                realType: "ByteArray",
                astType: "array",
                returnType: "ByteArray",
            },
        ],
        returnValue: "ByteArray",
    },
};

export function serialize(ast) {}
