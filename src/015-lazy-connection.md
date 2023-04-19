# Create database connections lazily

> Note that this means a new connection has to be established everytime you access the database, which might cause performance and desynchronisation issue. For example, your program might not know the database is defective until the first access.

It is possible to create a `DatabaseConnection` object with no minimum active connection in the connection pool until needed. The method is to set `min_connections` to `0` in connect options:

```rust, no_run
let mut options = ConnectOptions::new(url);
options.min_connections(0);

// Obtain the DatabaseConnection object here
Database::connect(options).await?
```