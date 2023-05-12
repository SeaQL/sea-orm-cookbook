# Raw and Unprepared Statements

## Raw SQL

> Documentation and Examples in the [docs](https://www.sea-ql.org/SeaORM/docs/basic-crud/raw-sql/)

While it is highly recommended to use SeaQuery's generalized interface for creating queries, it is possible to convert raw SQL statements into queries that the API accepts, with:

1. [`sea_orm::Statement::from_string`](https://docs.rs/sea-orm/latest/sea_orm/struct.Statement.html#method.from_string)
2. [`sea_orm::Transaction::from_sql_and_values`](https://docs.rs/sea-orm/latest/sea_orm/struct.Transaction.html#method.from_sql_and_values)
3. [`sea_orm::Statement::from_sql_and_values`](https://docs.rs/sea-orm/latest/sea_orm/struct.Statement.html#method.from_sql_and_values)

Note that they return `Self`, so you can use the result in any situations where they are respectively accepted.

**Also note that this method requires knowing the type of database backend you are using at compile time, and you are responsible for giving it the correct sql statements.**

## Unprepared SQL

> This method might be vulnerable to SQL injection!

An unprepared SQL are ones that are directly sent to the database without being processed by the ORM. It is highly not recommended unless you can prove the statements' correctness and security.

To send an unprepared SQL statement:

```rust, no_run
let db: DatabaseConnection = { /* */ };

// One statement
db.execute_unprepared("CREATE EXTENSION IF NOT EXISTS citext").await?

// Multiple statements
db.execute_unprepared("STATEMENT1; STATEMENT2; ...").await?
```