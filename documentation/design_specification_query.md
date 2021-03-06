# Specification: Agnesoft Database Query

Code generated interface to the Agnesoft Database. It consists of the Interface Description Language (IDL) schema and ADb Query Compiler that parses the IDL and generates code in supported languages.

-   [Interface Description Language IDL](#interface-description-language-idl)
    -   [Native Types](#native-types)
    -   [Custom Types](#custom-types)
        -   [alias](#alias) | [array](#array) | [function](#function) ([expressions](#function-expressions)) | [object](#object) | [variant](#variant)
-   [ADb Query Compiler](#adb-query-compiler)
    -   [Abstract Syntax Tree (AST)](#abstract-syntax-tree-ast)
        -   [alias](#alias-1) | [array](#array-1) | [function](#function--expressions) | [object](#object-1) | [variant](#variant-1) | [Parser](#parser)
    -   [Analyzer](#analyzer)
    -   [Serializer](#serializer)
        -   [byte](#byte) | [integers](#integers-Int64-Double) | [array](#array) | [object](#object) | [variant](#variant)
    -   [Code Generators](#code-generators)
        -   [C++](#c)

## Interface Description Language (IDL)

A JSON document that describes the types and functions (i.e. schema) of the query interface. The IDL is self contained and rely on very few "native" features in each supported langauge (described below). The root of the document is the object and each key represents a distinct type.

There are native types that are built-in and needs to be provided by the supported language, and custom types described in the schema.

### Native Types

These types must be available and provided by every supported language:

-   `Byte` (8-bit value)
-   `Int64` (64-bit signed two's complement integer)
-   `Double` (64-bit floating point integer)
-   `String` (implementation defined string representation)

### Custom Types

Each custom type can be one of the following kind:

-   `alias`
-   `array`
-   `function`
-   `object`
-   `variant`

These constructs must be available and provided by every supported language.

#### alias

Represents an alias of a different type. Its value must be a defined type. It can be any native or custom type including another alias.

Syntax:

```
"Id": "Int64"
```

Implicit aliases:

-   `"Byte": <implementation defined>`
-   `"Int64": <implementation defined>`
-   `"Double": <implementation defined>`
-   `"String": <implementation defined>`
-   `"i": "Int64"`
-   `"Offset": "Int64"`
-   `"Index": "Int64"`
-   `"Buffer": "ByteArray"`

#### array

Represents a dynamic array of another defined type (native or custom). There can be only one type of values in an array.

Syntax:

```
"Ids": ["Int64"]
```

Array functions:

-   `"size": { "arguments": [], "body": <implementation defined>, "return": "Int64" }"` (a function that returns number of values in the array as `Int64`)
-   `"at": { "arguments": ["Int64"], "body": <implementation defined>, "return": <arrayType> }` (a function that takes index as `Int64` argument and returns mutable value at that position in the array)

Implicit arrays:

-   `"ByteArray": ["Byte"]`

#### function

Represents a sequence of instructions. Can be a standalone function or a method (part of an `object`, see below). A function has following properties:

-   arguments (OPTIONAL: an array of existing types)
-   body (REQUIRED: an array of strings each representing an expression)
-   return (OPTIONAL: a single existing type that is the returned value)

The only mandatory field is `body`. The `arguments` is a list of types (native or custom) that are to be passed into the function as arguments. The `return` must be a single type (native or custom). The `body` is the list of string expressions (see below).

Syntax:

```
"foo": {
    "arguments": ["ArgType1"],
    "body": [ "return ArgType1" ],
    "return": "ArgType1"
}
```

Implicit function declarations:

-   `"deserializeDouble": { "arguments": ["Buffer", "Offset"], "body": <implementation defined>, "return": "Double" }"` (a function that takes a `Buffer` buffer and returns the `Double` value at the `Offset` from the buffer as-is and increments `Offset` by the count of read bytes)
-   `"deserializeInt64": { "arguments": ["Buffer", "Offset"], "body": <implementation defined>, "return": "Int64" }"` (a function that takes a `Buffer` buffer and returns the `Int64` value at the `Offset` from the buffer as-is and increments `Offset` by the count of read bytes)
-   `"serializeDouble": { "arguments": ["Buffer", "Offset", "Double"], "body": <implementation defined> }"` (a function that takes a `Buffer` buffer and serializes the `Double` value as-is at the `Offset` and increments `Offset` by the count of written bytes)
-   `"serializeInt64": { "arguments": ["Buffer", "Offset", "Int64"], "body": <implementation defined> }"` (a function that takes a `Buffer` buffer and serializes the `Int64` value as-is at the `Offset` and increments `Offset` by the count of written bytes)
-   `"stringFromBuffer": { "arguments": ["Buffer"], "body": <implementation defined>, "return": "String" }"` (a function that takes a `Buffer` and converts it to a native `string`)
-   `"stringToBuffer": { "arguments": ["String"], "body": <implementation defined>, "return": "Buffer" }"` (a function that takes a native `string` and converts it to `Buffer`)
-   `"Int64ToLittleEndian": { "arguments": ["Int64"], "body": <implementation defined>, "return": "Int64" }` (a function that takes an `Int64` value in native endianness and returns it in the little endian byte order)
-   `"DoubleToLittleEndian": { "arguments": ["Double"], "body": <implementation defined>, "return": "Double" }` (a function that takes a `Double` value in native endianness and returns it in the little endian byte order)
-   `"Int64ToNativeEndian": { "arguments": ["Int64"], "body": <implementation defined>, "return": "Int64" }` (a function that takes a little endian `Int64` value and returns it in native byte order)
-   `"DoubleToNativeEndian": { "arguments": ["Double"], "body": <implementation defined>, "return": "Double" }` (a function that takes a little endian `Double` value and returns it in native byte order)

#### Function Expressions

There are following types of expressions:

-   function call
-   assignment
-   addition
-   if
-   for
-   return

Each expression is composed of types. Object fields, array types, variant types etc. are referenced using a dot syntax. Only valid combinations of known types (native or custom) or integer literals are allowed and only "compatible" types are allowed in an expression. If the given type is not accessible in the function context (is not an argument or an object field) it will be declared as a local variable and can be referenced by its type name for example in the return statement.

The referenced type's names serve also as the name of the instances. This simplifies the syntax and the identification of the instance that is inferred from the context. But it also has limitations in that it is not possible to have two variables of the same type used in the same context. Use an `alias` to create a new type for a different purpose (e.g. `Id`, `Count` or `Distance` all being aliases of `Int64`). The local variable, field or argument names need to be invented by the code generator.

There are also two special kinds of expressions - `if` and `for`. The former allows conditional execution. The latter allows iteration and implicitly declares a local variable `i` that represents the current iteration's value.

Constructors of objects are a special case. Objects can be called as any function by calling their name with object's fields as arguments (e.g. in a return expression).

Examples:

```
//function call
foo(Arg)

//method call
ObjType.foo(ArgType)

//assignment
ObjType.FieldType = ArgType

//addition
SomeArray += ArgType

//return
return SomeType

//constructor
Obj(arg1)

//if
if (arg1 == arg2) { foo() }

//for
for (5) { foo(i) }
```

#### object

A collection of properties (fields) and functions (methods). An object has following properties:

-   fields (OPTIONAL: list of types that are properties of the object)
-   functions (OPTIONAL: list of functions [see above] that are methods of the object)

The fields is the list of existing types (native or custom) that are properties of the given object. Functions are its methods defined as an object with the same syntax as the standalone functions (keys are function names etc.). Object functions work in the same way as standalone ones but have the types declared in the object `fields` property available in their context. The `fields` are also arguments to constructor call of each object type.

Syntax:

```
"Obj": {
    "fields": ["FieldType1", "FieldType2"],
    "functions": {
        "foo": {
            "body": [ "return FieldType1" ],
            "return": "FieldType1"
        }
    }
}

```

There are no implicit objects.

#### variant

Represents a union type (a type that can be one of the other predefined types). There must be at least two variant types and max 256.

Syntax

```
"MyVariant": ["Var1", "Var2"]
```

Variant functions:

-   `"Index": { "arguments": [], "body": <implementation defined>, "return": "Byte" }` (returns `Byte` index of the currently active value in the variant)

There are no implicit variants.

## ADb Query Compiler

Javascript program that translates the ADb Query IDL first into the Abstract Syntrax Tree (AST) and from it generates code in supported langauges.

### Abstract Syntax Tree (AST)

The IDL parser validates the schema and translates it into AST. The AST is a much richer version of the original JSON with additional deduced information needed for code generation. Each type generates a different IDL object and all are stored under their original type names in a single AST object as its properties for cross referencing:

#### alias

```
AliasName: {
    type: "alias",
    name: "AliasName",
    aliasedType: "AliasedType"
}
```

#### array

```
MyArr: {
    type: "array",
    name: "MyArr",
    arrayType: "ArrayType"
}
```

#### function & expressions

```
foo: {
    type: "function",
    name: "foo",
    arguments: [ { name: "ArgType1", out: true }],
    body: [
        {
            type: "=", //=, +=
            left: {
                type: "new", //local, argument, field, number, new
                realType: "Int64,
                astType: "native",
                value: "Int64"
            },
            right: {
                type: "number", //local, argument, field, number, new
                realType: "Int64",
                astType: "native",
                value: 1
            }
        },
        {
            type: "+=", //=, +=
            left: {
                type: "field", //local, argument, field, number, new
                realType: "MyArr",
                astType: "array",
                value: "MyArr"
            },
            right: {
                type: "argument", //local, argument, field, number, new
                realType: "...",
                astType: "...",
                value: "ArgType1"
            }
        },
        {
            type: "call",
            value: "bar",
            realType: undefined,
            astType: undefined,
            arguments: []
        },
        {
            type: "constructor",
            value: "Obj",
            realType: "Obj",
            astType: "object",
            arguments: [arg1]
        },
        {
            type: "return",
            value: "ArgType1",
            realType: "Int64",
            astType: "native",
            returnType: "argument" //local, argument, field, number, new, undefined
        },
        {
            type: "if", //if, elseif, else
            condition: {
                left: {
                    type: "argument", //local, argument, field, number, new
                    value: "arg1"
                    realType: "Int64",
                    astType: "native"
                },
                type: "==",
                right: {
                    type: "argument", //local, argument, field, number, new
                    value: "arg2"
                    realType: "Int64,
                    astType: "native"
                },
            },
            body: []
        },
        {
            type: "for",
            iterations: {
                type: "number",
                value: 5,
                realType: "Int64",
                astType: "native"
            },
            body: []
        }
    ],
    return: "ArgType1"
}
```

#### object

```
Obj: {
    type: "object",
    name: "Obj",
    fields: [ "FiedlType1", "FieldType2" ],
    functions: {
        foo: {
            type: "function",
            name: "foo",
            arguments: [],
            body: []
            returnValue: undefined
        }
    },
    usedBeforeDefined: true
}
```

#### variant

```
{
    type: "variant",
    name: "MyVariant",
    variants: ["Var1", "Var2"]
}
```

### Parser

Parser translates the IDL into flat AST with no additional information. It performs syntax checking such as whether the type of the JSON token following another is valid in the IDL context, whether given construct evaluates into something known etc. It also breaks down function expressions detecting their types and other basic information.

### Analyzer

The AST is then passed over to the Analyzer that validates whether all referenced types are declared and everything makes sense by following aliases, analysing both sides of expressions in context of previous expressions, function calls, argument and type compatibility etc. It also further augments the expressions with additional context information such as whether the given expression fragment references a field, an argument or is a new local variable, adds information about underlying (real) types etc.

### Serializer

The AST is then passed over to the Serializer that adds (de)serialization functions for all native and custom types. They provide common AST representation of the code that produces the same binary data from any supported language. Individual types assume following serialization rules and layouts:

#### byte

As is.

#### integers (Int64, Double)

The `Int64` and `Double` are always serialized in the little endian byte order regardless of the platform (on big endian platforms the value is converted to little endian first). The value is deserialized as little endian and in case of big endian platform converted to that byte order.

#### array

Size of the array in bytes as `Int64` followed by the serialized values.

#### object

Individual fields serialized after each other in the order of declaration (no alignment).

#### variant

Index of currently active variant as a single `Byte` index (interpreted as an unsigned 8-bit integer value) followed by the serialized active variant.
Currently active variant.

---

**NOTE ON STRINGS**

The ADb Query assumes the `byte array` (`[Byte]`) to represent all data in serialized form. Every programming language uses their own native string representation that does not always adhere to this representation. In some languages strings are UTF-16 (two bytes per character), in others they are UTF-8 (variable number of bytes per character). Some languages offers a choice between the two (e.g. C++ `std::string`, `QString` in Qt etc.). The binary representation differs (e.g. UTF-16 takes twice as many bytes as it has characters). Storing a string in one language and reading it in another without agreeing on the encoding can have surprising results. It is not feasible to enforce an encoding (e.g. UTF-8) due to many variations and because not all data are (human readable/interpretable) strings. It is therefore up to the user to make sure the right encoding is used when using the `String` type for values.

---

### Code Generators

Every supported language has its own generator that generates code from the final AST. The code is fully native to the target programming language. The routines for (de)serialization must be carefully generated so that they produce the same binary data that is deserializable in other supported langauges, particularly in ADb's native C++.

#### C++

The special case is C++ as the generated code is considered the primary interface and basis for the ADb itself. In case of incompatibilities/inconsistencies between supported languages the version generated for C++ is considered correct.
