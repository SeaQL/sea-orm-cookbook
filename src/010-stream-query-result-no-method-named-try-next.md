# Stream query result - no method named try_next

You can stream the query result to reduce memory allocation and improve efficiency.

```rust, no_run
// Stream all fruits
let mut stream = Fruit::find().stream(db).await?;

while let Some(item) = stream.try_next().await? {
    let item: fruit::ActiveModel = item.into();
    // do something with item
}
```

However, you might encountered an error like `no method named try_next`. If that so, you need to update your `Cargo.toml` at your project root.

```toml, no_run
futures = "0.3"
```

Then, import [futures::TryStreamExt](https://docs.rs/futures/latest/futures/stream/trait.TryStreamExt.html) into the scope.

```rust, no_run
// Import the trait where `try_next` method is defined.
use futures::TryStreamExt;

// Stream all fruits
let mut stream = Fruit::find().stream(db).await?;

while let Some(item) = stream.try_next().await? {
    let item: fruit::ActiveModel = item.into();
    // do something with item
}
```

You're good to go. Compile the project again and enjoy!
