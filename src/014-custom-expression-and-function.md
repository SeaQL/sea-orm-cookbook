# How to use custom expressions and functions
## Custom Expressions
Custom expressions are merely just [`SimpleExpr`](https://docs.rs/sea-query/latest/sea_query/expr/enum.SimpleExpr.html) that you write yourself in SQL syntax instead of using the library's API. Many functions uses this type as parameters, see [this](https://docs.rs/sea-query/latest/sea_query/expr/enum.SimpleExpr.html?search=SimpleExpr).

Assume we have the following table:
```rust, no_run
thing {
    id: i32,
    field: String,
}
```

Here is one example of the use of `Expr::cust`:
```rust, no_run
Query::select()
    .column(thing::Column::Id)
    .from(thing::Table)
    .and_where(Expr::cust("field = \"asdf\""));

Query::select()
    .column(thing::Column::Id)
    .from(thing::Table)
    .and_where(Expr::col(thing::Column::Field).eq("asdf"));
```

They both evaluate to `SELECT id FROM thing WHERE field = "asdf"`

2 more advanced versions of [`Expr::cust`](https://docs.rs/sea-query/latest/sea_query/expr/struct.Expr.html#method.cust) are [`Expr::cust_with_exprs`](https://docs.rs/sea-query/latest/sea_query/expr/struct.Expr.html#method.cust_with_exprs) and [`Expr::cust_with_values`](https://docs.rs/sea-query/latest/sea_query/expr/struct.Expr.html#method.cust_with_values), where `IntoIterator<Item = Into<SimpleExpr>>` and `IntoIterator<Item = Into<Value>>` parameters are accepted in addition to format the given string.

The example below is self explanatory:

```rust, no_run
let values = ["asdf", "fdas"];

// Evaluates to `SELECT id FROM thing WHERE field = "asdf" OR field = "fdsa"`
Query::select()
    .column(thing::Column::Id)
    .from(thing::Table)
    .and_where(Expr::cust_with_values("field = ? OR field = ?", values));

// Evaluates to `SELECT id FROM thing WHERE field = "fdsa" OR field = "asdf"`
// note the difference in order
Query::select()
    .column(thing::Column::Id)
    .from(thing::Table)
    .and_where(Expr::cust_with_values("field = $2 OR field = $1", values));
```

`Expr::cust_with_exprs`'s usage is the exact same except only types that implement `Into<SimpleExpr>` are accepted.

## Custom Functions
Custom functions are those defined in the following ways: [MySQL](https://dev.mysql.com/doc/refman/8.0/en/create-procedure.html), [PostgreSQL](https://www.postgresql.org/docs/current/xfunc.html), and [SQLite](https://www.sqlite.org/appfunc.html).

SeaQuery provides a way to systematically call the custom functions, by the use of [`Iden`](https://docs.rs/sea-query/latest/sea_query/types/trait.Iden.html) and [`Func::cust`](https://docs.rs/sea-query/latest/sea_query/func/struct.Func.html#method.cust).

Assume we have defined a function called `MY_FUNCTION` in the database. Before we are able to invoke it, a struct that implements `Iden` should be defined first since `Func::cust` accepts a `IntoIden`:

```rust, no_run
// Method 1: Do it the hard way
struct MyFunction;

impl Iden for MyFunction {
    fn unquoted(&self, s: &mut dyn Write) {
        write!(s, "MY_FUNCTION").unwrap();
    }
}

// Method 2: Do it the macro way
#[derive(Iden)]
#[iden = "MY_FUNCTION"]
struct MyFunction;
```

Now we can use `Func::cust`:

```rust, no_run
// `MY_FUNCTION()`
Func::cust(MyFunction);

// `MY_FUNCTION('hello')`
Func::cust(MyFunction).arg("hello");

// `MY_FUNCTION('a', 'b', 'c', 'd')`
Func::cust(MyFunction).args(vec!["a", "b", "c", "d"]);
```

`Func::cust` can be used in many places, with the following being a few of them:

```rust, no_run
// `SELECT MY_FUNCTION('hello')`
Query::select()
    .expr(Func::cust(MyFunction).arg("hello"));

// `SELECT * FROM thing WHERE MY_FUNCTION(IFNULL('field', 'asdf'))`
Query::select()
    .from(thing::Table)
    .and_where(
        Func::cust(MyFunction).arg(
            Expr::col(thing::Column::Field)
                .if_null("asdf")
            )
        );
```