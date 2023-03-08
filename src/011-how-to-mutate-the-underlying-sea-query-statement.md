# How to mutate the underlying SeaQuery statement?

How can I borrow a mutable reference of `sea_query::SelectStatement` out of `Entity::find()`. So that I could add my custom window expression and select from a custom view etc.

You can use the `QueryTrait::query()` method to borrow the underlying SeaQuery statement out of any SeaORM types implemented `QueryTrait` ([listed here](https://docs.rs/sea-orm/latest/sea_orm/query/trait.QueryTrait.html#implementors)).

```rs
use sea_orm::QueryTrait;

let find = cake::Entity::find();

// Borrow `sea_query::SelectStatement` and customize it
let select_stmt: &mut sea_query::SelectStatement = find.query()
    .expr_window_as(
        Func::cust(RowNumber),
        WindowStatement::partition_by(...),
        Alias::new(...),
    )
    .from(...);
```
