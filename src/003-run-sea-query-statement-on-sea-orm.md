# How to run SeaQuery statement on SeaORM?

I have a complex query written in SeaQuery and I wish to run it on SeaORM.

```rust, no_run
let attr_stmt = Query::select()
    .column(EntityAttrIden::Name.prefixed_with_table())
    .column(EntityIden::Datatype)
    .from(EntityIden::Entity)
    .join(
        JoinType::Join,
        EntityAttrIden::EntityAttribute,
        Expr::tbl(EntityIden::Entity, EntityIden::Id)
            .equals(EntityAttrIden::EntityAttribute, EntityAttrIden::EntityId),
    )
    .and_where(Expr::col(EntityIden::Name.prefixed_with_table()).eq(selector.of.clone()))
    .to_owned();
```

You need to first build the SeaQuery statement into [`Statement`](https://docs.rs/sea-orm/latest/sea_orm/struct.Statement.html) with [`StatementBuilder`](https://docs.rs/sea-orm/latest/sea_orm/trait.StatementBuilder.html).

```rust, no_run
let attr_stmt = Query::select() // Snip...

let builder = db.get_database_backend();
let stmt: Statement = builder.build(&attr_stmt);
```

Then, you can run the statement and fetch the result:

1. As [`QueryResult`](https://docs.rs/sea-orm/latest/sea_orm/struct.QueryResult.html)

```rust, no_run
let attr_stmt = Query::select() // Snip...
let builder = db.get_database_backend();

let query_res: Option<QueryResult> = db
    .query_one(builder.build(&attr_stmt))
    .await?;

let query_res = query_res.unwrap();
let name: String = query_res.try_get("", "name")?;

let query_res_vec: Vec<QueryResult> = db
    .query_all(builder.build(&attr_stmt))
    .await?;
```

2. Or, as any struct that implemented [`FromQueryResult`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.FromQueryResult.html)

```rust, no_run
let attr_stmt = Query::select() // Snip...
let builder = db.get_database_backend();

#[derive(Debug, Clone, FromQueryResult)]
struct AttributeMeta {
    name: String,
    datatype: Datatype,
}

let attributes: Vec<AttributeMeta> = AttributeMeta::find_by_statement(builder.build(&attr_stmt))
    .all(db)
    .await?
```
