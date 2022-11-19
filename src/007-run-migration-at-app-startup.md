# Run migration at application startup

How to apply all pending migration at application startup?

You can run the migration programmatically at startup by providing the database connection to the `Migrator::up` method.

```rust, no_run
// Initialize database connection
let db = Database::connect(&db_url).await?;

// Run all pending migrations
Migrator::up(&conn, None).await?;
```

Checkout the examples below:

+ [Actix v4 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example/api/src/lib.rs)
+ [Actix v3 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix3_example/api/src/lib.rs)
+ [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example/api/src/lib.rs)
+ [GraphQL Example](https://github.com/SeaQL/sea-orm/blob/master/examples/graphql_example/api/src/graphql/schema.rs)
+ [jsonrpsee Example](https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example/api/src/lib.rs)
+ [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example/api/src/lib.rs)
+ [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example/api/src/lib.rs)
+ [Salvo Example](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example/api/src/lib.rs)
+ [Tonic Example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example/api/src/lib.rs)
