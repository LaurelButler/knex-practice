//requiring the library

const knex = require('knex')

//using the environment variable

require('dotenv').config()

//invoking the knex() function. the arguments specify where to connect to, the username and password to use for connecting and which driver to use

const knexInstance = knex({
    client: 'pg',
    // connection: 'postgresql://dunder-mifflin@localhost/knex-practice',

    //if you set a password for the user, you need to specify the connection like this:
    // connection: 'postgresql://dunder-mifflin:password-here@localhost/knex-practice',

    //move the connection string into an environment variable, you dont want the connect details hard coded
    connection: process.env.DB_URL
})
console.log('connection successful');

//to start building the query, you first tell the knex instance which table you want to query

// const q1 = knexInstance('amazong_products').select('*').toQuery()
// const q2 = knexInstance.from('amazong_products').select('*').toQuery()
// console.log('q1:', q1)

// console.log('q2:', q2)

//this knexInstance shows all (*)
// knexInstance.from('amazong_products').select('*')
//     .then(result => {
//         console.log(result)
//     })

//build a query to select the identifier, name, price, and category of one product: 
//the .first() method will only select the first item found

knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where({ name: 'Point of view gun' })
    .first()
    .then(result => {
        console.log(result)
    })

const qry = knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where({ name: 'Point of view gun' })
    .first()
    .toQuery()
// .then(result => {
//   console.log(result)
// })

console.log(qry)

//The LIKE operator specifies we want to search by a pattern
//The % is a "wildcard" for 0 or more characters
//This will allow 0 or more characters either side of the searchTerm. For example, the SQL we want would be like so if the searchTerm was "cheese":
// SELECT product_id, name, price, category
// FROM amazong_products
// WHERE name LIKE '%cheese%'; but it must be changed to ILIKE which is the case insensitive search

const searchTerm = 'holo'

knexInstance
    .select('product_id', 'name', 'price', 'category')
    .from('amazong_products')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
        console.log(result)
    })

//put it in a function that accepts the searchTerm as a parameter so that we can use the word that the person decides when they're ready

function searchByProduceName(searchTerm) {
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        })
}

searchByProduceName('holo')