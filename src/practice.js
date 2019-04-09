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



//You need to build a query that allows customers to paginate the amazong_products table products, 10 products at a time
//use the LIMIT and OFFSET operators to achieve pagination. Limit tells us the number of items to display and offset will be the starting position in the list to count up to the limit from

//we want page 4, to find the offset: we'd minus one from the page number (3), multiply this number by the limit, 10, giving us 30
// SELECT product_id, name, price, category
// FROM amazong_products
// LIMIT 10
// OFFSET 30;


//paginateProducts function
function paginateProducts(page) {
    const productsPerPage = 10
    const offset = productsPerPage * (page - 1)
    knexInstance
        .select('product_id', 'name', 'price', 'category')
        .from('amazong_products')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        })
}

paginateProducts(2)



//You need to build a query that allows customers to filter the amazong_products table for products that have images
//We can't use image != NULL in our query as it would return every row, in SQL NULL gets special treatment, two NULL values can't be equivalent. So, we need to use the IS NOT NULL operator
// SELECT product_id, name, price, category, image
// FROM amazong_products
// WHERE image IS NOT NULL;


//In knex, we use the .whereNotNull() method and supply a column name
function getProductsWithImages() {
    knexInstance
        .select('product_id', 'name', 'price', 'category', 'image')
        .from('amazong_products')
        .whereNotNull('image')
        .then(result => {
            console.log(result)
        })
}

getProductsWithImages()


//You need to build a query that allows customers to see the most popular videos by view at Whopipe by region for the last 30 days
//query the whopipe_video_views table. Each row in this table reflects one view of a video. Each row has a region that the video was viewed and the datetime of the view. We need to count the number of views for each combination of region and video name
//We'll use the count() function to count the dates viewed
// We'll group our results by a combination of the video's name and region
// We'll sort the results by the region and order by the count with most popular first
// We need to use a WHERE to filter only results within the last 30 days

//count(date_viewed) to get the number of views for each combination of the GROUP BY video_name, region. We've also renamed the count(date_viewed) to "views"
// SELECT video_name, region, count(date_viewed) AS views
// FROM whopipe_video_views

//used now() - '30 days'::INTERVAL to calculate the datetime that's 30 days before now by using 30 days::interval from now(). Then we look for any date_viewed that is greater than 30 days before now.
// WHERE date_viewed > (now() - '30 days':: INTERVAL)

// GROUP BY video_name, region
// ORDER BY region ASC, views DESC;


function mostPopularVideosForDays(days) {
    knexInstance
        .select('video_name', 'region')
        //To achieve the SQL count(date_viewed) AS views we needed to use the .count method instead of listing the column in the select method
        .count('date_viewed AS views')
        .where(
            'date_viewed',
            '>',
            knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
        )
        .from('whopipe_video_views')
        .groupBy('video_name', 'region')
        //orderBy method allows us to "order by" multiple columns by specifying an array, we can also use objects in the array to specify different directions (ascending or descending) to "order by"
        .orderBy([
            { column: 'region', order: 'ASC' },
            { column: 'views', order: 'DESC' },
        ])
        .then(result => {
            console.log(result)
        })
}

mostPopularVideosForDays(30)

//Knex doesn't have methods for the now() - '30 days'::INTERVAL. Instead, knex provides a fallback method called .raw(). We can use the raw method to pass in "raw" SQL as a string.
// An extra security measure is to tell the raw method that the raw SQL contains user input.We used ?? to tell knex that this is the position in the raw SQL that will contain user input.We then specify the value for the user input as the second argument to.raw().This is called a prepared statement