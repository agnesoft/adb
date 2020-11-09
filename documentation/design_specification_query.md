# Specification: Agnesoft Database Query

Code generated interface to the Agnesoft Database. It consists of the Interface Description Language (IDL) schema and ADb Query Compiler that parses the IDL and generates it as code in supported languages.

## Interface Description Language (IDL)

A JSON document that describes the types and functions (i.e. schema). The schema describes query objects, results and builder functions. The IDL is self contained and rely only on very few "native" features in each supported langauge (described below). The root of the document is the object and each key represents a distinct type.

## Types

There are native types that are in-built and needs to be provided by the supported language, and custom types described in the schema.

### Native

- `byte` (8-bit value)
- `int64` (64-bit signed two's complement integer)
- `double` (64-bit floating point integer)

### Custom types

Each custom type can be one of the following:

- `alias`
- `array`
- `function`
- `object`
- `variant`

#### alias

Represents an alias of a different type. Its value must be an existing (defined) type. It can be any native or custom type including another alias.

Syntax:
```
"Id": "int64"
```

#### array

Represents an array of another defined type (native or custom). There can be only one type in the array.

Syntax:
```
"Ids": ["int64"]
```

#### function

Represents a sequence of instructions. Can be a standalone type or a method (part of an `object`, see below). A function has following properties:

- arguments
- body
- return

The only mandatory field is `body`. The `arguments` is a list of types (native or custom). The `return` must be a single type (native or custom). The `body` is the list of string expressions.

Syntax:
```
"foo": {
    "arguments": ["ArgType1"],
    "body": [ "return ArgType1" ],
    "return": "ArgType1"
}
```

#### Function Expressions

There are three types of expressions:

- function call
- assignment
- addition
- return

Each expression is composed of types. Object fields, array types, variant types etc. are referenced using a dot syntax. Only valid combinations of known types (native or custom) or integer literals are allowed and only "compatible" types are allowed on both sides of the expression. If the given type is not accessible in the function context (is not an argument or object field) it will be declared as a local variable and can be referenced by its type name for example in the return statement.

Examples:
```
//function call
ObjType.foo(ArgType)

//assignment
ObjType.FieldType = ArgType

//addition
Array.ArrayType += ArgType

//return
return SomeType
```

#### object

A collection of properties (fields) and functions (methods). An object has following properties:

- fields
- functions

The fields is the list of existing types (native or custom) that are properties of the given object. Functions are its methods defined as an object with the same syntax as the standalone functions (keys are function names etc.). Object functions work in the same way as standalone ones but have the object `fields` part of their context.

Syntax:
```
"Obj": {
    "fields": ["FieldType1", "FieldType2"],
    "functions: {
        "foo": { body: [] }
    }
}

```

#### variant

Represents a union type (a type that can be one of the other predefined types).

Syntax

```
"MyVariant": ["Var1", "Var2"]
```

## ADb Query Compiler

Javascript program that translates the ADb Query IDL first into the Abstract Syntrax Tree (AST) and from it generates code in supported langauges.

### Abstract Syntax Tree (AST)

The IDL parser validates the schema and translates it into AST. The AST is a much richer version of the original JSON with additional deduced information suitable for code generation. Each type generates a different IDL object and all are stored under their original type names in a single AST object for cross referencing:

#### alias

```
{
    type: "alias",
    name: "AliasName",
    aliasedType: "AliasedType"
}
```

#### array

```
{
    type: "array",
    name: "MyArr",
    arrayType: "ArrayType"
}
```

#### function & expressions

```
{
    type: "function",
    name: "foo",
    arguments: ["ArgType1],
    body: [ 
    {
        type: "assignment",
        left: {
            type: "new",
            value: "int64"
        },
        right: {
            type: "number",
            value: 1
        }
    },
    {
        type: "addition",
        left: {
            type: "field",
            value: "MyArr"
        },
        right: {
            type: "argument",
            value: "ArgType1"
        }
    },
    {
        type: "function",
        value: "bar",
        arguments: []
    },
    {
        type: "return",
        value: "ArgType1",
        returnType: "argument"
    } ],
    return: "ArgType1"
}
```

#### object

```
{
    type: "object",
    name: "Obj",
    base: "BaseObj",
    fields: [ "FiedlType1", "FieldType2" ],
    functions: [
        {
            type: "function",
            name: "foo",
            arguments: [],
            body: []
            returnValue: undefined
        }
    ]
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

Parser translates the IDL into flat AST with no additional information. It performs syntax checking such as whether the type of the element following another is valid, whether given construct evaluates into something known etc. It also breaks down function expressions detecting their types and other basic information.

### Analyzer

The AST is then passed over to the Analyzer that validates whether all referenced types are declared and everything makes sense by following aliases, analysing both sides of expressions and in context of previous expressions etc. It also further augments the expressions with additional context information such as whether the given expression part references a field, an argument or is a new local variable.

### Serializer

The AST is then passed over to the Serializer that augments the existing types with the (de)serialization functions. They provide common AST representation of the code that producs the same binary data from any supported language.

*Integers*

The `int64` and `double` are always stored in the little endian byte order regardless of the platform and retrieved converting them to the endianness of the current platform (from the little endian byte order).

*Strings*

The ADb Query assumes the `byte array` (`[int64]`) to represent all data including strings. Every programming language uses their own native string representation. In some languages this is UTF-16 (two bytes per character), in others this is UTF-8 (variable number of bytes per character). The binary representation differs (e.g. UTF-16 takes twice as many bytes as it has characters). Storing a string in one language and reading it in another without agreeing on the encoding can have surprising results. It is not feasible to enforce an encoding (e.g. UTF-8) for all the data because not all data are strings. It is therefore up to the user to make sure the right encoding is used when using strings.

### Code Generators

Every supported language has its own generator that generates code from the final AST. The code is fully native to the target programming language. The routines for (de)serialization must be carefully generated so that they produce the same binary data that is deserializable in other supported langauges, particularly in ADb's native C++.

*C++*

The special case is C++ as the generated code is considered the primary interface and basis for the ADb itself. In case of incompatibilities/inconsistencies between supported languages the version generated for C++ is considered correct.

