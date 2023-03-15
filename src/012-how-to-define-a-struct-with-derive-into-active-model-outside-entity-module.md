# How to define a struct with DeriveIntoActiveModel outside entity module?

I know I can define a custom struct and derive `DeriveIntoActiveModel` which implements `IntoActiveModel` for me.

```rs
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

// My custom ActiveModel
#[derive(DeriveIntoActiveModel)]
pub struct NewFruit {
    pub name: String,
    pub cake_id: i32,
}
```

However, how can I define such custom struct in another module?

All you need is one extra line that import the target `ActiveModel` into the scope.

```rs
mod post_model {
    // Import the target ActiveModel into scope
    use super::entity::cake::ActiveModel;

    // My custom ActiveModel
    #[derive(DeriveIntoActiveModel)]
    pub struct NewFruit {
        pub name: String,
        pub cake_id: i32,
    }
}
```
