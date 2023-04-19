# Configuring Schema Search Path in PostgreSQL

> This only works if you use PostgreSQL, and will have no effect on any other databases supported. For documentations on the schema search path settings in PostgreSQL, see [here](https://www.postgresql.org/docs/current/ddl-schemas.html#DDL-SCHEMAS-PATH).

The [`ConnectOptions`](https://docs.rs/sea-orm/latest/sea_orm/struct.ConnectOptions.html) object allows for the configuration of search path:

```rust, no_run
let mut options = ConnectOptions::new(url);

// You need to define `path` yourself!
options.set_schema_search_path(path);

// Obtain the DatabaseConnection object here
Database::connect(options).await?
```