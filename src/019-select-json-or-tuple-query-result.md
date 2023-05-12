# Select JSON or tuple query result

For example we have the following table:
```rust, no_run
Person {
    id: i32,
    name: String,
    age: u16,
}
```

Normally, we want the whole record, and do:

```rust, no_run
let result: Option<person::Model> = person::Entity::find_by_id(id).one(&db).await?;
```

This returns a `person::Model` object. But sometimes we just want some of the columns, for example, only `name`:

```rust, no_run
let result: Option<String> = person::Entity::find_by_id(id)
        .select_only()
        .column(person::Column::Name)
        .into_tuple()
        .one(&db)
        .await?;
```

For multiple columns, it can also output in JSON or tuple:
```rust, no_run
// JSON
let result: Option<sea_orm::query::JsonValue> = person::Entity::find_by_id(id)
        .select_only()
        .columns([person::Column::Name, person::Column::Age])
        .into_json()
        .one(&db)
        .await?;

// Tuple
let result: Option<(String, u16)> = person::Entity::find_by_id(id)
        .select_only()
        .column_as([person::Column::Name, person::Column::Age])
        .into_tuple()
        .one(&db)
        .await?;
```