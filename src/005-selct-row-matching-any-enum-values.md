# Select rows matching any of the enum values

Let say, we want to select any `breakfast` serving everyday tea and breakfast tea.

```rust, no_run
use sea_orm::entity::prelude::*;

// `Tea` enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
pub enum Tea {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
    #[sea_orm(string_value = "EarlGreyTea")]
    EarlGreyTea,
}
```

```rust, no_run
use sea_orm::entity::prelude::*;

// `breakfast` entity
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "breakfast")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub bread: String,
    pub tea: Tea,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```

We can perform the select as follows:

```rust, no_run
use sea_orm::sea_query::{BinOper, Expr};

// Filter `IS IN (EverydayTea, BreakfastTea)`
let rows: Vec<breakfast::Model> = Entity::find()
    .filter(
        Expr::col(breakfast::Column::Tea)
            .binary(BinOper::In, Expr::tuple([
                Tea::EverydayTea.as_enum(),
                Tea::BreakfastTea.as_enum(),
            ]))
    )
    .all(db)
    .await?
    .unwrap();

// Or, inverse of it, filter `IS NOT IN (EarlGreyTea)`
let rows: Vec<breakfast::Model> = Entity::find()
    .filter(
        Expr::col(breakfast::Column::Tea)
            .binary(BinOper::NotIn, Expr::tuple([Tea::EarlGreyTea.as_enum()]))
    )
    .all(db)
    .await?
    .unwrap();
```
