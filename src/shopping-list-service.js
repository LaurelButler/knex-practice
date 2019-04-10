const shoppingListService = {
    allItems(knex) {
        return knex
            .select('*')
            .from('shopping_list')
    },
    deleteItem(knex, id) {
        return knex('shopping_list')
            .where({id})
            .delete()    
    },
    updateItem(knex, id, newItems) {
        return knex('shopping_list')
            .where({ id })
            .update(newItems)
    },
    insertItem(knex, insertNewItem) {
        return knex
            .insert(insertNewItem)
            .into('shopping_list')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
}

// module.exports(shoppingListService); //this was the wrong way to do it


module.exports = shoppingListService;