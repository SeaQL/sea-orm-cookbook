# Database Change Capture

> Documentation on transaction in SeaORM: [https://www.sea-ql.org/SeaORM/docs/advanced-query/transaction/](https://www.sea-ql.org/SeaORM/docs/advanced-query/transaction/), and see [here](https://docs.rs/sea-orm/0.11.3/sea_orm/trait.TransactionTrait.html#tymethod.transaction) for definitions

Sometimes it is important to have a log/history of what is changed in the database. One way to do this is to enclose the changes in a transaction, and perform the change capturing.

For example, here is a bundle of validation and change capture, all done within a transaction:
```rust, no_run
// Some kind of error type
type E;

// Function to perform change capture
async fn change_capture(object: &table_name::ActiveModel) -> Result<(), E> { ... }

// Function to perform validation
async fn validate(object: &table_name::ActiveModel) -> Result<(), E> { ... }

// ...

// Perform the transaction sandwiched between the validation and change capture
db.transaction::<_, ?, E>(|txn| {
    Box::pin(async move {
        validate(&object).await?;

        object.operation().await?;

        change_capture(&object).await?;

        Ok(?)
    })
})
```

One thing about this method is that the transaction will be automatically cancelled if anything throws an error, which includes **changes to the database** done during change capture.