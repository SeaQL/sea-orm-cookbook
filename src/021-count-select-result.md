# Count number of selected result

A naive way to approach this problem is to fetch the selection from the database, have it converted to a vector, then check the length of the vector. This is however, very expensive, and SeaORM provides a method to count without actually fetching with [`PaginatorTrait::count`](https://docs.rs/sea-orm/latest/sea_orm/trait.PaginatorTrait.html#method.count). `PaginatorTrait` is implemented by `Select`, `SelectTwo`, `Selector`, and `SelectorRaw`. So one can get the count by first creating such object, then call the method. For example:

```rust, no_run
// Create a Select object
let selection = table::Entity::find();

// Count the number of selection
selection.count().await?
```