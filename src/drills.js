require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});


// function searchName(searchTerm) {
//     knexInstance
//         .select('*')
//         .from('shopping_list')
//         .where('name', 'ILIKE', `%${searchTerm}%`)
//         .then(result => {
//             console.log({ searchTerm })
//             console.log(result)
//         })
// };

// searchName('urger');



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