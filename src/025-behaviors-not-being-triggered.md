# ActiveModelBehavior not being triggered

> Read first: [https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelBehavior.html](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelBehavior.html)

Be careful that the behaviors only apply to the following methods:
1. [`ActiveModelTrait::insert`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelTrait.html#method.insert)
2. [`ActiveModelTrait::update`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelTrait.html#method.update)
3. [`ActiveModelTrait::save`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelTrait.html#method.save)
4. [`ActiveModelTrait::delete`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.ActiveModelTrait.html#method.delete)

It is possible to perform similar action with the functions of [`EntityTrait`](https://docs.rs/sea-orm/latest/sea_orm/entity/trait.EntityTrait.html), but they **will not** trigger the behaviors, by design.