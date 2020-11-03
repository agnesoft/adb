# High Level Design

The **Agnesoft Database** or **ADb** is the graph database system written in C++. It can operate as either embedded database in a client program or as a server based database accessed via a network protocol. The database is primarily designed for

- read performance
- real time data access
- scalability

## Variants

The database operates in two forms - embedded or server.

### Embedded

The embedded is in-process variant that comes in a form of static or dynamic library directly linked to the client program. It is accessed directly using C++ application programming interface (API). This API can be exposed to other languages in standard form dependent on the language. The databse does not run any event loop or continuous processing of its own.

### Server

The database server is a stand alone process accessed via a network (or a local socket) connection. It actively listens for new connections and processes network requests returning responses to the client.

## Query

Commands to the database, regardless of the database variant, are issued in the form of queries. Queries in ADb are objects with certain properties that are used by the database to execute the command and possibly return a result. Query objects are constructed using a [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) that resembles English and also SQL natively in every supported language. The query interface for every supported language including ADb's native C++ is generated from a query IDL.

The reason for constructing queries directly in a programming language (as opposed to text based queries) is their inherent syntactic correctness, IDE driven autocomplete and performance (no need for parsing).

### Interface Description Language (IDL)

The ADb Query IDL is using JSON as its format. The IDL describes the query objects, their layout, result objects, all supported types and also the builder pattern to create the queries. IDL Parser is used to create the abstract syntax tree (AST) of the Query IDL that can be used by a language generator to generate code in any language (including C++). 

The reason for using IDL and code generation is to provide scalable & maintainable way to provide multiple language bindings. Every change to the IDL or AST generator would propagate to all supported languages. Furthermore having common definition of the object layouts on binary level for serialization of the queries allow them to be created in any language and interpreted/executed in ADb's native C++ without expensive transport formats (e.g. xml, json, yaml etc.) and/or need for deserialization.

### Examples

A query that selects all database elements reachable from element with index `10` that have an associated key "price" with value that is smaller than `10.0`.

```
//C++
const auto query = adb::select().elements().from(5).where().key("price").lessThan(10.0);

//Javascript
const query = adb.select().elements().from(5).where().key("price").lessThan(10.0);

//C
const auto query = select().elements().from(5).where().key("price").lessThan(10.0);

//Python
query = select().elements().from(5).where().key("price").lessThan(10.0);
```

The query builders are almost identical in most programming languages.

## Database



## Components
