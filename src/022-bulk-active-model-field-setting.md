# Bulk ActiveModel field setting

Imagine the situation where one has the table:

```rust, no_run
TableName {
    id: i32,
    field1: T,
    field2: T,
    ...
    fieldN: T,
}
```

To create an `ActiveModel` of this table, one can painstakingly set each field to `ActiveValue<T>::NotSet`:

```rust, no_run
let new_thing = table_name::ActiveModel {
    id: ActiveValue::NotSet,
    field1: ActiveValue::NotSet,
    field2: ActiveValue::NotSet,
    // ...
    fieldN: ActiveValue::NotSet,
};
```

or implement the Default trait which I will not show here.

However, I shall enlighten you with a trick within SeaORM - creating the model with JSON:

```rust, no_run
let json = json!({ "fieldX": value });

let new_thing = table_name::ActiveModel::from_json(json)?;
```

Where `new_thing` will evaluate to `fieldX` being `ActiveValue<T>::Set` and all other fields set to `ActiveValue<T>::NotSet` automatically.

Setting of field values can also be performed on existing instances of `ActiveModel` with [`ActiveModelTrait::set_from_json`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelTrait.html). **Note that this method will not change the primary key value if it is set.**