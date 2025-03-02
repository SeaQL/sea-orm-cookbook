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

This connection is, however, only locally accessible, and each establishment of connection is very costly. To solve it, one would like to create a static connection that only has to be established once.

```rust, no_run
use tokio::sync::OnceCell;

static DB_CLIENT: OnceCell<DatabaseConnection> = OnceCell::const_new();

#[tokio::main]
async fn main() {
    DB_CLIENT
        .get_or_init(|| async {
            let database_url = "database_url".to_string();
            let mut opt = ConnectOptions::new(database_url);
            Database::connect(opt).await.unwrap()
        })
        .await;

    let conn = DB_CLIENT.get().unwrap();

}
```

Now any scopes inside of the same module can access the `DB_CLIENT` static variable and use it as a connection to the database without establishing connection everytime. For example

```rust, no_run
fn a_function() -> Result<(), !> {
    DB_CLIENT.do_something().await?;
}
```

For `DB_CLIENT` to be visible from other modules, simply add `pub` in front of `static DB_CLIENT:...`.
