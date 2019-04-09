require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});


function searchName(searchTerm) {
    knexInstance
        .select('*')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log({ searchTerm })
            console.log(result)
        })
};

searchName('urger');



function getAllItemsPaginated(pageNumber) {
    const itemLimit = 6
    const offset = itemLimit * (pageNumber - 1);
    knexInstance
        .select('*')
        .from('shopping_list')
        .limit(itemLimit)
        .offset(offset)
        .then(result => {
            console.log('PAGINATE ITEMS', { pageNumber })
            console.log(result)
        })
};

getAllItemsPaginated(2);



// function addedProducts(daysAgo) {
//     knexInstance
//         .select('*')
//         .from('shopping_list')
//         .where('date_added' '>' )
// }



function costPerCategory() {
    knexInstance
        .select('category')
        .count('price as total')
        .from('shopping_list')
        .groupBy('category')
        .then(result => {
            console.log(result)
        })
}

costPerCategory()