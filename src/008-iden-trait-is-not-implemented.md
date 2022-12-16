# `Iden` trait is not implemented

The `Iden` trait is a construct to represent identifier in SQL statement.

## Static Identifier

Usually, identifier is static and Enum is a natural representation of it. You can define and implement `Iden` with the help of the derive macros.

```rust, no_run
use sea_orm::sea_query::Iden;

#[derive(Debug, Iden)]
enum User {
    Table,
    Id,
}
assert_eq!(Iden::to_string(&User::Table), "user");
assert_eq!(Iden::to_string(&User::Id), "id");

#[derive(Debug, Iden)]
#[iden = "user"]
enum Custom {
    Table,
    #[iden = "my_id"]
    Id,
    FirstName,
}
assert_eq!(Iden::to_string(&Custom::Table), "user");
assert_eq!(Iden::to_string(&Custom::Id), "my_id");
assert_eq!(Iden::to_string(&Custom::FirstName), "first_name");
```

## Dynamic Identifier

However, if you have a dynamic identifier constructed at runtime, then you need `Alias` for this purpose.

```rust, no_run
use sea_orm::sea_query::{Alias, Iden};

let iden = Alias::new("id");
assert_eq!(Iden::to_string(&iden), "id");
```
