# Check if columns in ActiveModel are set

Given a `ActiveModel` object, one can check if a specific column is set:

```rust, no_run
let object: table::ActiveModel = { ... };

// Specific field
object.field_name.is_set()  // <- do something with this boolean

// Field iterator
for column in table::Column::iter() {
    object.get(column).is_set() // <- do something with this boolean
}
```