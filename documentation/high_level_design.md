# High Level Design

## Problem

The database solutions are dominated by the [relational databases](https://en.wikipedia.org/wiki/Relational_database) that use [Structured Query Language (SQL)](https://en.wikipedia.org/wiki/SQL) for querying them. Relational databases organize the data in data tables with rows and columns. This concept has two major flaws:

1. Despite the name there is no direct way of representing relations between different tables. This is typically solved by introducing meta data columns (so called foreign keys) that contain indexes in another table. This adds complexity and makes the database queries more complex and the database/data harder to maintain.

2. Tables are rigid data structures and manipulating the table structure (adding/removing/modifying columns) is often impossible requiring creation of a new table with the desired structure and copying the original data over. For the same reason representing sparse data in tables is problematic. Missing values in a row still needs some value (e.g. `null`, `0`, empty string etc.) while representing extra value represented only in some cases is outright impossible (requires new column).

With the constantly evolving needs of systems that use a database the rigidity of the relational databases poses a major problem. Because changing the structure (scheme) of such a database is extremely difficult and expensive while in production, significant amount of time and resources are spent in designing the database structure fit for a particular business need ahead of time. However it is impossible to design the relational database for future needs. Database scheme not fit for the business need can also easily suffer from degraded performance and inability to scale.

The solution to this problem exists in form of so called [NoSQL databases](https://en.wikipedia.org/wiki/NoSQL). There are many variants of such databases and there are not many common traits among them.

### Graph Databases

One type of NoSQL databases are graph databases. They solve the aforementioned problems by plotting the data on a [graph](https://en.wikipedia.org/wiki/Graph_database) instead in tables. The advantage of this approach is that the graph itself accurately represents the relations between the data (unlike the so called relational databases). The disadvantage is that SQL is not particularly well suited for querying such database. For that reasons the graph databases introduce their own query language in one way or another although support for SQL in them might still exist.

The shortcomings of the currently available databases are:

- They are written in Java
- They do not offer C++ bindings
- They use their own text based query language (including modified SQL)

### Text Based Database Queries

While SQL is de facto industry standard for querying databases. Since it is its own independent programming language to use it one needs to learn it in addition to the programming language of their choice. Since it is text based parsing is expensive. For the same reason syntactic errors are commonplace. Furthermore SQL is not particularly well suited for querying graph databases. 

## Design Overview

The **Agnesoft Database** or **ADb** is the graph database system written in C++. The database is primarily designed for:

- Schema flexibility
- Read performance
- Real time data access
- Unlimited scalability
- Native querying in all programming languages
- Use embedded (in-process) or as server

The ADb database consists of two main components:

- Agnesoft Database (ADb)
- ADb Query

## Agnesoft Database

The main structural component of the database is the [graph](https://en.wikipedia.org/wiki/Graph_database). The elements on the graph are nodes (points, vertices) and directed edges (arcs, connections) that connect the nodes. Both kinds of graph elements may have data associated with them in the form of `key-value` pairs. Every element on the graph has a unique 64-bit ID that is used to access and modify the element and its data. 

The ADb database graph is directed and there are no limitations to the numbers of edges between nodes; there can be multiple edges in the same direction between two nodes. There can also be edges connecting a node to itself. The graph can be both cyclic or acyclic. The database graph can also contain multiple disjointed/independent subgraphs.

All of the graph data are persisted in a single database file. The data are stored in machine independent binary format that can be read & modified on any machine regardless of its origin. The database can be replicated by other instances (sharding) or be extended by other instances (possibly over a network). Running queries on one instance is therefore capable of searching multiple instances that appears as one database to the client.

The database is [ACID](https://en.wikipedia.org/wiki/ACID) compliant, provides write transactions and concurrent reads. By default the database is schema-less and does not have any user based access. Both can however be achieved in number of ways. The ADb configuration and all meta information are stored in the database itself.

The database performance is mostly independent from the amount of data stored. Accessing elements and data has constant time complexity. Searching the database has linear time complexity. There are no indexes. The graph structure is capable of perfectly capturing the relations between data. Therefore searches are typically simpler and shorter in comparison to other databases and there is no real need for an index (the graph itself is the index).

### Variants

The database operates in two forms - embedded or server.

**Embedded**

The embedded means in-process as a static or dynamic library directly linked to the client program. It is accessed directly using C++ application programming interface (API). This API can be exposed to other languages in standard form dependent on the language. The database does not run any event loop or continuous processing of its own.

**Server**

The database server is a stand alone process accessed via a network (or a local socket) connection. It actively listens for new connections and processes network requests returning responses to the client.

## ADb Query

Commands to the database, regardless of the database variant, are issued in the form of queries. Queries in ADb are C++ objects with certain data fields that are used by the database to execute the command and possibly return a result. Query objects are constructed using a [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) in every supported language. The pattern intentionally resembles English and SQL. The query interface for every supported language including ADb's native C++ is generated from a query IDL.

The benefits of constructing queries directly in a programming language (as opposed to text based queries) is their inherent syntactic correctness, IDE driven autocomplete and performance (no need for parsing).

The queries support named placeholders and unlimited nesting.

### Interface Description Language (IDL)

The ADb Query IDL is using JSON as its main format. The IDL describes the query objects, result objects and also the builder pattern to create the queries. The IDL Parser is used to create the abstract syntax tree (AST) from the query IDL. The AST can be used by a language generator to generate code in any language (including C++). 

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
