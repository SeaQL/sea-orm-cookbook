# Set column value with database function

How can we set the expiry date of all fruits contains the word "Apple"?

```rust, no_run
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub expiry: Option<DateTimeWithTimeZone>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```

Since [update one](https://www.sea-ql.org/SeaORM/docs/basic-crud/update/#update-one) only takes value instead of expression. We need [update many](https://www.sea-ql.org/SeaORM/docs/basic-crud/update/#update-many) for this purpose.

```rust, no_run
use sea_orm::sea_query::Expr;

// UPDATE `fruit` SET `expiry` = CURRENT_TIMESTAMP WHERE `fruit`.`name` LIKE '%Apple%'
fruit::Entity::update_many()
    .col_expr(fruit::Column::Expiry, Expr::current_timestamp())
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;
```
