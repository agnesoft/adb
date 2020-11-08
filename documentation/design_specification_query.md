# Specification: Agnesoft Database Query

Code generated interface to the Agnesoft Database.

## Interface Description Language (IDL)

A JSON document that describes the types and functions (i.e. schema) that are part of the Agnesfot Database interface. The root of the document is the object and each key represents a distinct type.

## Types

There are native (in built) and custom types.

### Native

- `byte` (8-bit value)
- `int64` (64-bit signed two's complement integer)
- `double` (64-bit floating point integer)

### Custom types

Each custom type can be one of the following:

- alias (a different name of an existing type)
- array (list of values of the same type)
- function (a.k.a. subroutine, sequence of instructions)
- object (collection of properties and functions)
- variant (a value that can be one of different types)

#### alias

Represents an alias of a different type (including another alias) defined in the schema or of a native type.

Syntax:
```
"Id": "int64"
```

#### array

Represents an array of another defined type (custom or native).

Syntax:
```
"Ids": ["int64"]
```

#### function

Represents a sequence of instructions. Can be a standalone type or a method (part of an `object`). A function has following properties:

- arguments
- body
- return

The only mandatory field is `body`.

Syntax:
```
"foo": {
    "arguments": ["ArgType1"],
    "body": [ "return ArgType1" ],
    "return": "ArgType1"
}
```

#### object

A collection of properties (fields) and functions (methods). An object has following properties:

- fields
- functions

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

## Code Generators

## Serialization

*Integers*

The `int64` and `double` are always stored in the little endian byte order regardless of the platform and retrieved converting them to the endianness of the current platform (from the little endian byte order).

*Strings*

The ADb Query assumes the `byte array` to represent all data including strings. Every programming language uses their own native string representation. In some languages this is UTF-16 (two bytes per character), in others this is UTF-8 (variable number of bytes per character). The binary representation differs (e.g. UTF-16 takes twice as many bytes as it has characters). Storing a string in one language and reading it in another without agreeing on the encoding can have surprising results. It is not feasible to enforce an encoding for all the data (some data may be binary blobs) and all use cases. It is therefore up to the user to make sure the right encoding is used.
