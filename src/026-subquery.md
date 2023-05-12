# Subquery

> Read first: [Introduction to sub query in SQL](https://www.w3resource.com/sql/subqueries/understanding-sql-subqueries.php)

> Also read: [Documentation on subquery in SeaORM](https://www.sea-ql.org/SeaORM/docs/advanced-query/subquery/)

As it is not mentioned explicitly in the documentation, one might think that SeaORM only supports subquery for `WHERE..IN..` as in the documentation. However, looking at the [documentation of SeaQuery](https://docs.rs/sea-query/latest/sea_query/expr/enum.SimpleExpr.html), and [search for subquery](https://docs.rs/sea-query/latest/sea_query/expr/enum.SimpleExpr.html?search=into_sub_query_statement), one shall be presented with that SeaQuery supports subquery just like any other expressions. 

A `Select`/`Insert`/`Update`/`Delete`/`With` Statement can be converted to a `SubQueryStatement`, then into `SimpleExpr`, with the variant `SimpleExpr::SubQuery(Option<SubQueryOper>, Box<SubQueryStatement>)`.

The application is trivial and has been left as an exercise for the reader.