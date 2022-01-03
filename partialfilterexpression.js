// partialIndexes and partialFilterExpression parameter
// partial indexes
db.collection.createIndex()


db.restaurants.createIndex()
// we will be using the partialFilterExpression

db.restaurants.createIndex(
    {cusine: 1, name: 1},
    {partialFilterExpression: {
        rating: {
            $gt: 5 //the index will only apply to documents with a rating greater than 5
        }
    }}
)


db.restaurants.find( { cuisine: "Italian", rating: { $gte: 8 } } )

db.restaurants.find( { cuisine: "Italian", rating: { $lt: 8 } } )

db.restaurants.find({cuisine:"Italian"})

// comparing a partial index with a sparse index.
// The sparse index will ignore records where the field does not exist
// The partial index will ignore records not captured in the partialFilterExpression


// If the name exists then the index will be applied this is the exact same as a sparse index
db.contacts.createIndex(
    {name:1},
    {
        partialFilterExpression: {
            name: {
                $exists: true
            }
        }
    }
)


// Creating a partial index using partialfilterexpression
db.restaurants.insertOne(
    {
        "_id" : ObjectId("5641f6a7522545bc535b5dc9"),
        "address" : {
           "building" : "1007",
           "coord" : [
              -73.856077,
              40.848447
           ],
           "street" : "Morris Park Ave",
           "zipcode" : "10462"
        },
        "borough" : "Bronx",
        "cuisine" : "Bakery",
        "rating" : { "date" : ISODate("2014-03-03T00:00:00Z"),
                     "grade" : "A",
                     "score" : 2
                   },
        "name" : "Morris Park Bake Shop",
        "restaurant_id" : "30075445"
     }
)

// Choosing only to index ratings that are grade A
db.restaurants.createIndex(
    {borough: 1, cuisine: 1},
    {
        partialFilterExpression: {
            "rating.grade": {
                $eq: "A"
            }
        }
    }
)

// Using a partial idnex with unique constraint
db.users.insertMany([
    { "_id" : ObjectId("56424f1efa0358a27fa1f99a"), "username" : "david", "age" : 29 },
    { "_id" : ObjectId("56424f37fa0358a27fa1f99b"), "username" : "amanda", "age" : 35 },
    { "_id" : ObjectId("56424fe2fa0358a27fa1f99c"), "username" : "rajiv", "age" : 57 }
])

db.users.drop()

db.users.createIndex(
    {username: 1},
    {unique: true, partialFilterExpression: {
        age: {
            $gte: 21
        }
    }}
)

db.users.insertMany( [
    { username: "david", age: 27 },
    { username: "amanda", age: 25 },
    { username: "rajiv", age: 32 }
 ] )

 