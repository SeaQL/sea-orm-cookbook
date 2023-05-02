# Defining newtypes

> Read the documentations at [https://www.sea-ql.org/SeaORM/docs/generate-entity/newtype/](https://www.sea-ql.org/SeaORM/docs/generate-entity/newtype/)

Note that any newtype defined will have to be convertible to one of the traditional database types defined in [sea_query::value::Value](https://docs.rs/sea-query/latest/sea_query/value/enum.Value.html), so use existing types unless really necessary.   