// There are some limitations on queries.
// We cannot refer to another key in another document
// query conditionals
// $lt, $lte, $gt, $gte
db.users.find({
    age: {
        $gte: 18, $lte : 30 //Remember that this will an AND
    }
})


// querying using dates
start = new Date('01/01/1970')
db.users.find({birthday: {
    $lt: start
}})

db.users.find({
    age : {
        $lt : 50
    }
})


registration1 = new Date('12/03/1998')
registration2 = new Date('12/03/2008')
registration3 = new Date('12/03/2018')
// $ne
// Not joe

db.users.insertMany([
    {"name" : "Angel", "age" : 30, "sex" : "male", "location" : "Wisconsin" , registered : registration1},
    {"name" : "Gwen", "age" : 24, "sex" : "female", "location" : "Wisconsin",  registered : registration1 },
    {"name" : "Sydney", "age" : 18, "sex" : "female", "location" : "Wisconsin",  registered : registration2 },
    {"name" : "Vienna", "age" : 22, "sex" : "female", "location" : "Wisconsin", registered : registration3 }
])

db.users.find({
    registered : {
        $lte : registration2
    }
})


db.users.find({
    name: {
        $ne: 'Joe', $ne :'Vienna'
    }
})

// OR Queries
// $in and $or do exactly what you think they do

db.users.find ({
    name: {
        $in : ['Vienna', 'Sydney']
    }
})

db.users.find ({
    name: {
        $nin : ['Vienna', 'Sydney']
    }
})


// $or
db.users.find({
    '$or': [{name: 'Vienna'},
     {age : {$in : [ 18]}}]
})

// $not 
db.users.find({
    name : {
        $not : {
            $in : ['Vienna']
        }
    }
})

// Type specific queries
// null it does match itself

db.c.insertMany([
    { "_id" : ObjectId(" 4ba0f0dfd22aa494fd523621"), "y" : null },
 { "_id" : ObjectId(" 4ba0f0dfd22aa494fd523622"), "y" : 1 },
 { "_id" : ObjectId(" 4ba0f148d22aa494fd523623"), "y" : 2 }
])

db.cSample.insertMany([
    { "_id" : 222, "y" : null },
 { "_id" : 344, "y" : 1 },
 { "_id" : 555, "y" : 2 }
])

// CHECK the key is null and also exists
db.cSample.find({
   y : {
       $eq: null, $exists: true
   }
})


// Regular Expressions
db.users.find({
    name : {
        $regex : /joe/i
    }
})

// Querying Arrays
db.food.insertOne({
    fruit : ['apple', 'pear', 'pomelo', 'peach']
})

// It will search the array
db.food.find({
    fruit : 'pear'
})


// $all allows for the matching of more than one element all fruits in the list must exist

db.food.insertMany([
    {fruit : ['apple', 'banana', 'orange']},
    {fruit : ['kiwi', 'pomelo', 'peach']},
    {fruit : ['cherry', 'banana', 'apple']}
])

db.food.find({
    fruit : {
        $all : ['apple', 'banana']
    }
})

// Exact math

db.food.find({
    fruit:  ['cherry', 'banana', 'apple']
})

// Query an array by the index
db.food.find({
    'fruit.1' : 'banana'
})

// $size length of the array

db.food.find(
    {
        'fruit' : {
            $size : 3
        }
    }
)

// $slice
// The optional parameter to find takes and argument to specify which keys to return
db.food.find(
    {}, {"fruit": {$slice: 2}}
)

// Returning matching array element
// $slice What if I want to search the array and return the matching element?


// Array and range query interactions
db.x.insertMany([
    {x : 5},
    {x : 15},
    {x: 25},
    {x:[5,25]}
])

db.x.find(
    {
        x : {$gt : 10 , $lt: 20}
    }
)
// Within an Array it will check every single element

// $elemMatch to force MongoDB to compare both clauses with a single array element.
// $elemMatch will not match nonarray elements

db.x.find({
    x : {
        $elemMatch : {
            $gt : 7, $lt: 30 // Is there an element that exists on here?
        }
    }
})

// Querying on Embedded Documents
// You can either query for the whole document or query for individual key values

db.people.insertOne({
    name : {
        first : 'Joe',
        last: 'Schmoe'
    }, 
    age: 45
})

// this is the best approach to do
db.people.find({
    'name.first': 'Joe'
})

db.people.find({
    name : {
        first: 'Joe',
        last: 'Schmoe'
    }
})

db.blogNew.insertOne({
    content: '....',
    comments: [
        {
            author: 'Joe',
            score: 3,
            comment: 'nice post'
        }, 
        {
            author: 'Mary',
            score: 6,
            comment: 'terrible post'
        }
    ]
})

// nested data querying
// $elemMatch is an AND every single criteria must match!
db.blogNew.find(
    {
        comments : {
            $elemMatch : {
                author: 'Mary',
                score : {
                    $gte: 5
                }
            }
        }
    }
)

// $where queries
// execute arbritrary JS with our query
db.foo.insertOne(
    {apple : 1, banana: 6, peach: 3},

)
db.foo.insertOne(
    {apple : 8, spinach: 4, watermelon: 4},
    
)

// What if I want to check if watermelon and spinach are equal?

// cursors

for(i=0; i< 100; i++) {
    db.collectionSample.insertOne({x : i})
}

var cursor = db.collection.find()

while( cursor.hasNext()) {
    obj = cursor.next();
}

cursor.forEach(function(x) {
    print(x.x)
})

cursor.sort({x: 1})


// sort
db.stock.find().sort({username: 1, age: -1})

// comparisions
// Single key with multiple types

// avoiding large skips
// Large skips should be avoided

db.people.insertOne({
    name: 'Joe',
    random: Math.random()
})

db.people.insertOne({
    name: 'John',
    random: Math.random()
})

db.people.insertOne({
    name: 'Jim',
    random: Math.random()
})


var random = Math.random()


result = db.people.findOne(
    {random : {
    $gt: random
  }
})


// Immortal Cursors
// What are indexes and why would we want to use them
// Choosing which fields to index
// Indexes are pre-determined ordered lists based on certain keys that you define and allow for faster querying using those keys

// A query that does not use an index is called a collection scan

for(i = 0; i < 100000; i++) {
    db.usersIndex.insertOne({
        "i": i,
        "username": "user"+i,
        "age": Math.floor(Math.random()*120),
        "created": new Date()
    })
}

db.usersIndex.find(
    {"username": 'user101'}
).explain('executionStats')

// Creating an index
db.usersIndex.createIndex({username: 1})
// Indexes do have their prices with write operations (insert updates, and deletes)
// Look through your queries and find the common sets of keys that people are using to query with. set those as an index


// Compound indexes
db.usersIndex.createIndex({'age': 1, 'username': 1})



db.usersIndex.find({}, {
    _id: 0,
    i: 0,
    created: 0
})


for(i = 0; i < 100000; i++) {
    db.studentsClasses.insertOne({
        "student_id": i ,
        "scores": [
            {type: 'exam', score: Math.random()},
            {type: 'quiz', score: Math.random()},
            {type: 'homework', score: Math.random()}
        ],
        'class_id': i % 8
    })
}

db.studentClasses.createIndex({'class_id': 1})

db.studentClasses.createIndex({student_id: 1, class_id: 1})

db.studentClasses.find({
    student_id: {
        $gt : 50000
    }, 
    class_id: 6
}).sort({student_id: 1}).explain('executionStats')


// Choosing key directions
// For compound keys the order will matter db.collection.createIndex({username: -1, acton: 1})

// Covered Queries 
// Covered queries are essentially queries where all keys are in the index and therefore covered and do not need to find the document
// using the pointer back

// YOU GET FREE INDEXES ON ANY PREFIX OF AN INDEX'S keys. Sort order matters

// How $ operators use indexes

// Embedded index keys
db.locations.insertMany([
    {
        username: 'sid',
        loc: {
            ip: "1.2.3.4",
            city: "Springfield",
            state: "NY"
        }
    },
    {
        username: 'bob',
        loc: {
            ip: "1.2.3.5",
            city: "Duncan",
            state: "OH"
        }
    }
])

db.locations.createIndex({'loc.city': 1})

db.usersIndex.createIndex({username: 1}, {
    unique: true, // creates a unique index so that the collection will not accept insert/update of documents where index keys matches another document
    partialFilterExpression: {
        username: {
            $exists: true //The username must exist on the document for the index to consider it
        }
    }
})

db.usersIndex.insertOne({
    username: 'Hello'
})

db.usersIndex.createIndex({username: 1, age: 1})

db.usersIndex.insertMany([
    {username: "wee"},
    {username: "jack", age: 23},
    {username: 'fred', age: 23}
])

// Partial index will be done by using the partialFilterExpression

db.usersIndex.createIndex({
    email: 1
}, 
{
    unique: true, 
    partialFilterExpression: {
        email : {
            $exists: true 
        }
    }
})
// You can use the hint to force it to do a table scan

db.usersIndex.getIndexes()

// 2d and 2dsphere
db.geo.insertMany([
{
    name :"New York City",
    loc : {
        type: "Point",
        coordinates: [50, 2]
    }
},
{
    name: "Hudson River",
    loc: {
        type: "LineString",
        coordinates: [
            [0,1],
            [0,2],
            [1,2]
        ]
    }
}
]
)
// Now to create an index on a 2dsphere
db.geo.createIndex({loc: "2dsphere"})

// Types of Geospatial Queries
// 
var eastVillage = {
    type: "Polygon",
    coordinates : [
        [
        [ -73.9904979, 40.7305556 ],  [ -73.9907017, 40.7298849 ],  [ -73.9908171, 40.7297751 ],
         [ -73.9911416, 40.7286592 ], [ -73.9911943, 40.728492 ],  [ -73.9914313, 40.7277405 ],
          [ -73.9914635, 40.7275759 ],  [ -73.9916003, 40.7271124 ],  [ -73.9915386, 40.727088 ], 
           [ -73.991788, 40.7263908 ],  [ -73.9920616, 40.7256489 ],  [ -73.9923298, 40.7248907 ], 
            [ -73.9925954, 40.7241427 ],  [ -73.9863029, 40.7222237 ],  [ -73.9787659, 40.719947 ], [ -73.9772317, 40.7193229 ],
             [ -73.9750886, 40.7188838 ], [ -73.9732566, 40.7187272 ] ] ]
    }

db.openStreetMap.find({
    loc :{
        $geoIntersects : {
            $geometry : eastVillage
        }
    }
})

db.openStreetMap.find({
    loc : {
        $geoWithin :{
            $geometry : eastVillage
        }
    }
}
)

db.openStreetMap.find({
    loc :{
        $near : {
            $geometry : eastVillage
        }
    }
})

// geospatial indexes using 2dsphere
// mongodb geospatial working example

// importing restaurants and neighborhood:
// mongoimport.exe C:\Users\AMOD\Downloads\mongodb-the-definitive-guide-3e-master\mongodb-the-definitive-guide-3e-master\chapter6\restaurants.json -c restaurants
// mongoimport.exe C:\Users\AMOD\Downloads\mongodb-the-definitive-guide-3e-master\mongodb-the-definitive-guide-3e-master\chapter6\neighborhoods.json -c neighborhoods

// Now we can create a 2dspehre index on each collection
db.nieghborhoods.createIndex({
    location: '2dsphere'
})

db.neighborhoods.find()

db.restaurants.createIndex({
    location: '2dsphere'
})


db.neighborhoods.find({
    name: "Clinton"
})

// Finding the current neighborhood
// Using $geoIntersects
db.neighborhoods.findOne({
    geometry : {
        $geoIntersects : {
            $geometry :{
                type: "Point",
                coordinates: [
                    -73.93414657,
                    40.82302903
                ]
            }
        }
    } 
})

// Finding all restaurants in the neighborhood
var neighborhood = db.neighborhoods.findOne({
    geometry : {
        $geoIntersects : {
            $geometry : {
                type: "Point",
                coordinates : [
                    -73.93414657,
                    40.82302903
                ]
            }
        }
    }
})

db.restaurants.find({
    location : {
        $geoWithin: {
            $geometry : neighborhood.geometry
        }
    }
})

// $centerSphere is going to allow us to specify a circular region and it will return those results in unsorted order
db.restaurants.find({
    location: {
        $geoWithin : {
            $centerSphere: [[
                -73.93414657,
                40.82302903
            ], 
            5/3963.2  //radius in radians
        ]
        }
    }
})


// $nearSphere and then use it with $maxDistance
// This will return all restaurants within n miles of the user in sorted order

var METERS_PER_MILE = 1609.34
db.restaurants.find({
    location : {
        $nearSphere : {
            $geometry : {
                type: "Point", 
                coordinates : [-73.93414657, 40.82302903]
            }
        }
    }
})

// Compound Geospatial Indexes
// do it on name : 
db.restaurants.createIndex({
    name: 1, 
    location : "2dsphere"
})


// 2d indexes
// video game maps, time series data, etc use 2d
sample({
    name: "Water Temple",
    tile: [32, 22]
})

db.hyrule.createIndex({
    "light-years": "2d"
},
{
    min: -1000,
    max: 1000
})


// Indexes for Full Text Search
// Keyword searches for full text
// text indexes
// Creating a text index

db.articles.createIndex({title: "text", body: "text"})

// Text search
// $text
db.articles.find({
    $text : {
        $search: "impact crater lunar"
    }
}).limit(10)

// Capped Collections
// Capped Collections are created in advance and have a fixed size
// capped collections must be created before they can be used
db.createCollection('my_collection', {capped: true, size: 10000})


db.createCollection('myCollection2', {capped: true, size: 10000, max: 100})

// Tailable Cursors
// Tailable cursors are used only on capped collections

// Time to Live indexes
// set a timeout for each document

db.session.createIndex({lastUpdated: 1}, {expireAfterSeconds: 60*60*24})
// TTL INDEXES CANNOT BE COMPOUND INDEXES

// Storing files with GridFS
// GridFS is used to store binary large files onto Mongodb file storage
// GridFS is for file storage
// GridFS is good for large files that do not change much

// Getting started with GridFS mongofiles
// mongofiles cli
// With gridfs the files are divided into smaller documents and then there is one metadata document linking them together

