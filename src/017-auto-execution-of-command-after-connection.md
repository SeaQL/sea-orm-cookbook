# Automatically execute SQL after connecting to database

SeaORM does not provide direct support for this matter, but is it possible to. The method involves establishing the connection with [`sqlx`](https://crates.io/crates/sqlx) then converting it back to a `sea_orm::DatabaseConnection` object.

```rust, no_run
// Only copy the one that you are using
type DB = sqlx::Postgres;
type DB = sqlx::Sqlite;
type DB = sqlx::MySql;
```

Creation of sqlx options:

```rust, no_run
// Method 1: Convert from the `sea_orm::ConnectOptions` that you are familiar with
let mut sqlx_options: sqlx::pool::PoolOptions<DB>
    = sea_options.pool_options().after_connect(callback);

// Method 2: Create option directly in sqlx space
let mut sqlx_options = sqlx::pool::PoolOptions<DB>::new()
    // See https://docs.rs/sqlx/latest/sqlx/pool/struct.PoolOptions.html
    .after_connect(callback);
```

Connect to database with sqlx:
```rust, no_run
let sqlx_pool: Pool<DB> = sqlx_options.connect(url).await?;
```

Convert to SeaORM's `DatabaseConnection`:
```rust, no_run
/// MySQL
from_sqlx_mysql_pool(sqlx_pool)
/// SQLite
from_sqlx_sqlite_pool(sqlx_pool)
/// PostgreSQL
from_sqlx_postgres_pool(sqlx_pool)
```