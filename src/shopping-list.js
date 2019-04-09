require('dotenv').config()
const knex = require('knex')
const shoppingListService = require('./shopping-list-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

//have to pass knexInstance into allItems from the shopping-list-service file function
//this simply logs the data
// console.log(shoppingListService.allItems(knexInstance))


//this logs all items in the shopping list
shoppingListService.allItems(knexInstance).then(data => {
    console.log(data);
})