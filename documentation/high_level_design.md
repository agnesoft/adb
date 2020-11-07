# High Level Design

## Problem

The database solutions are dominated by the [relational databases](https://en.wikipedia.org/wiki/Relational_database) that organize the data in tables with rows and columns. The data is queried with text based [Structured Query Language (SQL)](https://en.wikipedia.org/wiki/SQL). These databases have several shortcomings:

1. There is no direct way of representing relationships between tables, rows and columns (despite the name - relational databases). The typical solution is the use of meta data columns that contain indexes in another table (foreign keys). This adds complexity and makes it hard to reason about the data and their relations.

2. Tables have rigid data structure (schema) that is impossible to change after creation. This makes representing sparse data (not all columns filled) or new unexpected data (new columns) a very hard problem especially for database design. The typical solution is creating a new database schema and importing the original data which is error prone and cumbersome.

3. Text based queries are their own separate programming language. They require to be learnt separately, have their own syntax, parsing etc. This constitutes a barrier between the database (and the data) and the client (user). Due to the problem no. 1 (no relations in relational databases) they also tend to be rather complex and hard to author. 

4. Scalability of relational databases vis-à-vis dataset size is generally poor. The typical solution is the use of indexes - essentially an in-built meta data system that makes lookup in selected columns faster. This solution however cannot cope with the ever growing amount of data and requirements on the database performance.

Other properties of relational databases or their implementations however are good and needs to be retained by any new system to replace them. For example:

- Platform independent.
- Database transactions.
- Use as an embedded database (e.g. [SQLite](https://www.sqlite.org/index.html)).
- [ACID - data atomicity, consistency, isolation, durability](https://en.wikipedia.org/wiki/ACID).

## Requirements

The solution to the problem is a database system that:

- Allow direct representation of data relationships.
- Allow changing the database schema (or even schema-less).
- Allow querying the database natively from a programming language.
- Allow embedded use.
- Allow server use.
- Allow database transactions.
- SQL compatible.
- Retain (constant) performance regardless of dataset size.
- Unlimited horizontal nad vertical scalability.
- ACID compliance.
- Platform independent.
- Platfomr inoperable (write on one platform, read on another).

## Existing Solutions

Some of the requiremnts can be met with [NoSQL databases](https://en.wikipedia.org/wiki/NoSQL). There are many variants of such databases but one particular type is well suited for addressing most of the above mentioned problems - [graph database](https://en.wikipedia.org/wiki/Graph_database). The existing graph databases (e.g. [Neo4J](https://neo4j.com/) or [OrientDB](https://www.orientdb.org/) however do not fulfill all of the requirements. They do not offer bindings for many programming languages (e.g. C++). They use their own text based query language. They do not offer an embedded solution. They are not ACID compliant etc.

## Agnesoft Database (ADb)

The **Agnesoft Database** or **ADb** is a graph database system. It comprises of two main components:

- Agnesoft Database (ADb)
- Agnesoft Database Query (ADb Query)

### Agnesoft Database

The database engine and data store:

#### Graph
The main structural component of the database is the [graph](https://en.wikipedia.org/wiki/Graph_database). The elements on the graph are nodes (points, vertices) and directed edges (arcs, connections) that connect the nodes. Every element on the graph has a unique indentifier that is used to access and modify the element and its relations. Elements can be added, modified or removed.

The database graph is:

- Directed graph.
- Allow multiple edges between two nodes.
- Allow multiple edges in the same direction.
- Allow edges connecting a node to itself.
- Allow cyclic graphs.
- Allow multiple disjointed subgraphs.

#### Data

Both kinds of the database graph elements (nodes and edges) have data associated with them in the form of `key-value` pairs. The data can be added, modified or removed. The data can be bound to a schema or be completely freeform. There cannot be duplicate keys associated with the same graph element.

#### Data Store

All of the database data including meta data such as configuration is persisted in a single file. The data is stored in machine independent binary format that can be read & modified on any platform. The file is protected via [write-ahead-logging](https://en.wikipedia.org/wiki/Write-ahead_logging). Operations over the file are atomic (transactional) and [ACID](https://en.wikipedia.org/wiki/ACID) compliant. The database performance is mostly independent from the amount of data stored. Accessing elements and data has constant time complexity. Searching the database has linear time complexity based on the searched subgraph. The data store allow concurrent reads but not concurrent writes.

#### Variants

The database can operate in both embedded or server mode:

*Embedded*

In the embedded mode the database is directly linked to the client program (either during the compile time or at runtime). It is accessed directly using application programming interface (API) from any supported language.

*Server*

The database server is a stand alone process accessed via a network (or a local socket) connection. It actively listens for new connections and processes network requests returning responses to the client. It allows concurrent connections and processing. In server mode the individual instances of the database can form a cluster and either replicate the data (sharding) or extend the available store capacity. The server mode provides credentials based access to the database.

### Agnesoft Database Query

The interface to the Agnesoft Database:

#### Queries

Commands to the database are issued in the form of database queries. Queries are binary objects passed to the database's public API. The query objects are constructed using a [builder pattern](https://en.wikipedia.org/wiki/Builder_pattern) in every supported language. The builder pattern resembles plain English and SQL. The queries support named placeholders and query nesting. The object definitions and the builder functions are generated for every supported language from the ADb IDL (Interface Description Language).

Example of the ADB Query builder pattern:
```
//C++
const auto query = adb::select().elements().from(5).where().key("price").lessThan(10.0);

//Javascript
const query = adb.select().elements().from(5).where().key("price").lessThan(10.0);

//Python
query = select().elements().from(5).where().key("price").lessThan(10.0);
```

#### ADb IDL

The Agnesoft Database's interface description language describes the query objects, result objects and also the builder functions that create the queries. The IDL Parser is used to create the abstract syntax tree (AST) from the query IDL. The AST is used by a language generators to generate code in the supported languages. The objects in IDL are constructed as immutable with the plain byte array backing so that they can be transported between programming languages without the need for further serialization or encoding/decoding. The string values are used as is (there is no enforced string encoding - it is the responsibility of the client to know/enforce the right encoding). Numbers (integers and floating types) are always stored as little endian regardless of the platform and retrieved converting them to the endianness of the current platform (from little endian).
