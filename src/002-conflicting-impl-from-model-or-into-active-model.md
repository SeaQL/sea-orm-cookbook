# Conflicting implementation of `From<M>` or `IntoActiveModel<A>`

Say, we have a entity define inside the entity crate.

```rust, no_run
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "posts")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub text: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```

And, we have a struct to hold user's input in the API crate.

```rust, no_run
#[derive(Debug)]
pub struct InsertModel {
    pub title: String,
    pub text: String,
}
```

Then, we need to convert `InsertModel` to `entity::post::ActiveModel` for inserting it to the database. One of the below impl block will perform the conversion for us. However, if you place the impl block inside the API crate you might result in compile errors.

1. Implements `From<InsertModel>` for `ActiveModel`:
    ```rust, no_run
    use sea_orm::Set;
    use entity::post::ActiveModel;

    impl From<InsertModel> for ActiveModel {
        fn from(model: InsertModel) -> Self {
            ActiveModel {
                title: Set(model.title),
                text: Set(model.text),
                ..Default::default()
            }
        }
    }
    ```
    The error messages:
    ```
    error[E0119]: conflicting implementations of trait `std::convert::From<InsertModel>` for type `entity::post::ActiveModel`
        |
        | impl From<InsertModel> for ActiveModel {
        | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        |
        = note: conflicting implementation in crate `entity`:
                - impl std::convert::From<<Entity as EntityTrait>::Model> for ActiveModel;
    ```

2. Implements `IntoActiveModel<ActiveModel>` for `InsertModel`:
    ```rust, no_run
    use sea_orm::{Set, IntoActiveModel};
    use entity::post::ActiveModel;

    impl IntoActiveModel<ActiveModel> for InsertModel {
        fn into_active_model(self) -> ActiveModel {
            ActiveModel {
                title: Set(self.title),
                text: Set(self.text),
                ..Default::default()
            }
        }
    }
    ```
    The error messages:
    ```
    error[E0119]: conflicting implementations of trait `actix_example_core::sea_orm::IntoActiveModel<entity::post::ActiveModel>` for type `InsertModel`
        |
        | impl IntoActiveModel<ActiveModel> for InsertModel {
        | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        |
        = note: conflicting implementation in crate `entity`:
                - impl IntoActiveModel<ActiveModel> for <Entity as EntityTrait>::Model;
    ```

Why and how to get over it?

[Rust's orphan rules](https://smallcultfollowing.com/babysteps/blog/2015/01/14/little-orphan-impls/) are the reason behind this error. We could move the `InsertModel` struct and its conversion implementation blocks into entity crate.

```rust, no_run
use sea_orm::{entity::prelude::*, IntoActiveModel, Set};

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "posts")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    pub text: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

// Define InsertModel and its conversion implementation blocks

#[derive(Debug)]
pub struct InsertModel {
    pub title: String,
    pub text: String,
}

impl From<InsertModel> for ActiveModel {
    fn from(model: InsertModel) -> Self {
        ActiveModel {
            title: Set(model.title),
            text: Set(model.text),
            ..Default::default()
        }
    }
}

impl IntoActiveModel<ActiveModel> for InsertModel {
    fn into_active_model(self) -> ActiveModel {
        ActiveModel {
            title: Set(self.title),
            text: Set(self.text),
            ..Default::default()
        }
    }
}
```
