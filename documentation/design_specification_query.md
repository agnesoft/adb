# Specification: Agnesoft Database Query

Code generated interface to the Agnesoft Database. It consists of the Interface Description Language (IDL) schema, its parser and language generators for supported languages. The IDL is first translated into Abstract Syntax Tree (AST) by the parser and the AST is then used by the language generators to generate the code in supported languages.

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

## Abstract Syntax Tree (AST)

The IDL parser validates the schema and translates it into AST. The AST is a much richer version of the original JSON with additional deduced information suitable for code generation. Each type generates a different IDL object and all are stored under their original type names in a single AST object for cross referencing:

### alias

```
{
    type: "alias",
    name: "AliasName",
    aliasedType: "AliasedType"
}
```

### array

```
{
    type: "array",
    name: "MyArr",
    arrayType: "ArrayType"
}
```

### function & expressions

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

### object

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

### variant

```
{
    type: "variant",
    name: "MyVariant",
    variants: ["Var1", "Var2"]

}
```

## Code Generators

## Serialization

*Integers*

The `int64` and `double` are always stored in the little endian byte order regardless of the platform and retrieved converting them to the endianness of the current platform (from the little endian byte order).

*Strings*

The ADb Query assumes the `byte array` to represent all data including strings. Every programming language uses their own native string representation. In some languages this is UTF-16 (two bytes per character), in others this is UTF-8 (variable number of bytes per character). The binary representation differs (e.g. UTF-16 takes twice as many bytes as it has characters). Storing a string in one language and reading it in another without agreeing on the encoding can have surprising results. It is not feasible to enforce an encoding for all the data (some data may be binary blobs) and all use cases. It is therefore up to the user to make sure the right encoding is used.
