# Entity without primary key column

In SeaORM, we assume every entity has a primary key. A table without primary key breaks many assumptions about the concept of Entity, and hence methods like `find_by_id` is not possible.

```
error: Entity must have a primary key column. See <https://github.com/SeaQL/sea-orm/issues/485> for details.
 --> src/entity/lineitem.rs:4:35
  |
4 | #[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
  |                                   ^^^^^^^^^^^^^^^^^
  |
  = note: this error originates in the derive macro `DeriveEntityModel` (in Nightly builds, run with -Z macro-backtrace for more info)
```

We strongly recommend adding a primary key to every entity if modifying the schema is an option.

```diff
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "lineitem")]
pub struct Model {
+   #[sea_orm(primary_key)]
+   pub id: i32,
    pub price: Decimal,
    pub quantity: i32,
    pub order_id: i32,
    pub cake_id: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    // ...
}

impl ActiveModelBehavior for ActiveModel {}
```
