# Create database connections lazily

> Note that this means a new connection has to be established everytime you access the database, which might cause performance and desynchronisation issue. For example, your program might not know the database is defective until the first access.

It is possible to create a `DatabaseConnection` object with no minimum active connection in the connection pool until needed. The method is to create a SQLx connection pool with `connect_lazy` function then convert it into `DatabaseConnection`:

```rust, no_run
// MySQL
let mysql_pool = sqlx::MySqlPool::connect_lazy("mysql://root:root@localhost").unwrap();
let db: sea_orm::DatabaseConnection = sea_orm::SqlxMySqlConnector::from_sqlx_mysql_pool(mysql_pool);

// Postgres
let pg_pool = sqlx::PgPool::connect_lazy("postgres://root:root@localhost").unwrap();
let db: sea_orm::DatabaseConnection = sea_orm::SqlxPostgresConnector::from_sqlx_postgres_pool(pg_pool);

// SQLite
let sqlite_pool = sqlx::SqlitePool::connect_lazy("sqlite::memory:").unwrap();
let db: sea_orm::DatabaseConnection = sea_orm::SqlxSqliteConnector::from_sqlx_sqlite_pool(sqlite_pool);
```