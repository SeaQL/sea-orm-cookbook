# How to make a static Database Connection

> Read first: [Documentation on Connection Pool](https://www.sea-ql.org/SeaORM/docs/install-and-config/connection/)

Everytime we access the database, we need to establish a connection, or as we call it, a "Connection Pool" beforehand. The most trivial way is to create the connection everytime we need to access it:

```rust, no_run
// Establish connection
let db = Database::connect(url).await?;

/* Some operations on db */

// Close connection
db.close().await?;
```

This connection is, however, only locally accessible, and each establishment of connection is very costly. To solve it, one would like to create a static connection that only has to be established once. Doing so requires the [`lazy_static`](https://crates.io/crates/lazy_static) and [`async-std`](https://crates.io/crates/async-std) crate.


```rust, no_run
lazy_static::lazy_static! {
    static ref DB: DatabaseConnection = {
        async_std::task::block_on(async {
            // You have to define `url` yourself!
            Database::connect(url).await.unwrap()
        })
    };
}
```

Now any scopes inside of the same module can access the `DB` static variable and use it as a connection to the database without establishing connection everytime. For example

```rust, no_run
fn a_function() -> Result<(), !> {
    DB.do_something().await?;
}
```

For `DB` to be visible from other modules, simply add `pub` in front of `static ref DB:...`.