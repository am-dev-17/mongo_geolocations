// The update operator
db.books.remove({});

db.books.insertMany([
  {
    "_id" : 1,
    "item" : "TBD",
    "stock" : 0,
    "info" : { "publisher" : "1111", "pages" : 430 },
    "tags" : [ "technology", "computer" ],
    "ratings" : [ { "by" : "ijk", "rating" : 4 }, { "by" : "lmn", "rating" : 5 } ],
    "reorder" : false
   },
   {
    "_id" : 2,
    "item" : "XYZ123",
    "stock" : 15,
    "info" : { "publisher" : "5555", "pages" : 150 },
    "tags" : [ ],
    "ratings" : [ { "by" : "xyz", "rating" : 5 } ],
    "reorder" : false
   }
]);

db.books.update(
    {_id:  1},
    {
        $inc: {stock: 5},
        $set: {
            item: "ABC123",
            "info.publisher": "2222",
            tags: ["software"],
            "ratings.1": {by: "xyz", rating: 3}
        }
    }
)

// Pushing elements to existing arrays
// To push items to an existing array we use the $push operator
db.books.update(
    { _id: 2 },
    {
      $push: { ratings: { "by" : "jkl", "rating" : 2 } }
    }
 )

 db.books.update(
     {_id: 2},
     {
         $push :{
             ratings: {
                 by: "jkl", rating: 2
             }
         }
     }
 )


//  The $unset operator
// The $unset operator will remove fields from the mongoDB documents
db.books.update(
    {_id: 1},
    {
        $unset: {
            tags: 1
        }
    }
)

// Update multiple documents with $update and multi
db.books.update(
    {stock : {$lte: 10}},
    {$set: {recorder: true}},
    {multi: true}
)

// Upsert with Replacement Document
db.books.update(
    {item: "ZZZ135"},
    {
        item: ZZZ135,
        stock: 5,
        tags: ['database']
    },
    {upsert: true}
)

db.people.update(
    { name: "Andy" },
    { $inc: { score: 1 } },
    {
      upsert: true,
      multi: true
    }
 )

 db.people.createIndex({name: 1}, {unique:true})


//  Upsert with Operator Expression $set
db.books.update(
    {item: "BLP921"},
    {
        $set: {reorder: false},
        $setOnInsert: {stock: 10}
    },
    {upsert: true}
)

// Upate with the $rename operator
db.students.updateOne(
    {_id: 1},
    {$rename: {nickname: alias}}
)

// The mul operator
db.products.insertOne(
    { "_id" : 1, "item" : "Hats", "price" : Decimal128("10.99"), "quantity" : 25 }
 )

// Multiplies the field by the value that you place here
db.products.updateOne(
   { _id: 1 },
   { $mul:
      {
         price: Decimal128( "1.25" ),
         quantity: 2
       }
   }
)

// $min and $max
db.scores.insertOne( { _id: 1, highScore: 800, lowScore: 200 } )

db.scores.updateOne(
    {_id: 1},
    {$min: {
        lowScore: 150 //Will compare whether the current value is the min or is it this one
    }}
)


// The positional operator
db.students.insertMany( [
    { "_id" : 1, "grades" : [ 85, 80, 80 ] },
    { "_id" : 2, "grades" : [ 88, 90, 92 ] },
    { "_id" : 3, "grades" : [ 85, 100, 90 ] }
 ] )


db.students.updateOne(
    {_id: 1, grades: 80}, //$ acts as a placeholder for the first match
    {$set: {
        "grades.$": 82
    }}
)

db.students.insertOne({
    _id: 4,
    grades: [
       { grade: 80, mean: 75, std: 8 },
       { grade: 85, mean: 90, std: 5 },
       { grade: 85, mean: 85, std: 8 }
    ]
  })

  db.students.updateOne(
      {_id: 4, "grades.grade": 85},
      {$set: {"grades.$.std": 6}}
  )

// $pull will remove any elements that match in the array element that was specfied in pull
db.stores.updateMany(
    { },
    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } }
)

db.survey.insertMany([
    {
       _id: 1,
       results: [
          { item: "A", score: 5 },
          { item: "B", score: 8 }
       ]
    },
    {
       _id: 2,
       results: [
          { item: "C", score: 8 },
          { item: "B", score: 4 }
       ]
    }
 ] )

 db.survey.updateMany(
    { },
    { $pull: { results: { score: 8 , item: "B" } } }
  )

//   $push will push onto an array
db.students.insertOne( { _id: 1, scores: [ 44, 78, 38, 80 ] } )

// append multiple values to the array $push and $each
db.students.updateOne(
    {_id: 1},
    {
        $push: {
            scores: {
                $each : [90, 92,85]
            }
        }
    }
)

// Using the push operator with multiple modifiers
db.students.insertOne(
    {
       "_id" : 5,
       "quizzes" : [
          { "wk": 1, "score" : 10 },
          { "wk": 2, "score" : 8 },
          { "wk": 3, "score" : 5 },
          { "wk": 4, "score" : 6 }
       ]
    }
 )


 db.students.updateOne(
     {_id: 5},
     {
         $push :{
             quizzes: {
                 $each: [{wk: 5, score: 8}, {wk:6, score: 7}, {wk: 7, score: 6}],
                 $sort: {score: -1},
                 $slice: 3
             }
         }
     }
 )

//  $each is going to allow you to $push multiple elements into the array

// $slice
db.students.updateOne(
    {_id: 1},
    {
        $push : {
            scores: {
                $each: [80, 70, 84],
                slice: -5
            }
        }
    }
)

// $position operator
// specifies the location at which the $push operator will insert elements

db.students.updateOne(
    {_id: 1},
    {
        $push: {
            scores : {
                $each: [50, 60, 70],
                $position: 0
            }
        }
    }
)


// Deletes
db.collection.drop() // This will drop a collection
db.collection.drop({writeConcern: {w:1}})

// Write Concern
// majority of members have been written to 
// speciify a number will make it so that it is n number of votes


// remove command
db.collection.remove()

db.products.remove({
    qty: {
        $gt: 20
    }
})

// deleteOne
db.orders.insertOne({
    _id: ObjectId("563237a41a4d68582c2509da"),
    stock: "Brent Crude Futures",
    qty: 250,
    type: "buy-limit",
    limit: 48.90,
    creationts: ISODate("2015-11-01T12:30:15Z"),
    expiryts: ISODate("2015-11-01T12:35:15Z"),
    client: "Crude Traders Inc."
 })

 db.orders.deleteOne(
     {
         _id: ObjectId("563237a41a4d68582c2509da")
     }
 )

 db.orders.insertOne({
    _id: ObjectId("563237a41a4d68582c2509da"),
    stock: "Brent Crude Futures",
    qty: 250,
    type: "buy-limit",
    limit: 48.90,
    creationts: ISODate("2015-11-01T12:30:15Z"),
    expiryts: ISODate("2015-11-01T12:35:15Z"),
    client: "Crude Traders Inc."
 })


// Expiring data from collections by setting a TTL
db.log_events.createIndex({createdAt: 1}, {expireAfterSeconds: 10})

db.log_events.insertOne( {
    "createdAt": new Date(),
    "logEvent": 2,
    "logMessage": "Success!"
 } )


//  Expire the documents at a specific clock time
db.log_events.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )

db.log_events.insertOne( {
    "expireAt": new Date('July 22, 2013 14:00:00'),
    "logEvent": 2,
    "logMessage": "Success!"
 } )

//  Indexes
db.collection.createIndex( { name: -1 } ) //An index of the same specification must not exist

// Indexes with names
db.products.createIndex(
    {item: 1, quantity: -1},
    {name: "query for inventory"}
)

// single field index
// compound index
// multikey index - Indexes content that is stored in arrays -- Each array item will stored as an index key
// 2d indexes - This is for geospatial
// text indexes - allows for text search across fields
// hashed indexes - indexes the hash of the value of the field and are great for sharding -- equality matches only
// unqiue indexes - unique property will not allow multiple of the same keys remember that is a combination of the keys
// partial indexes - Allows for a filter expression and then it will only index documents that match the filter
// sparse indexes - If the indexed field is missing, then the document will not be indexed
// TTL indexes - automatically remove documents after n seconds or after the specified date
// Hidden indexes - allows you to hide an index without actually deleting it.

// Single Field Indexes
db.records.createIndex({"location.state": 1})

// compound indexes
// A single index will be made up of multiple fields
db.products.insertMany([
    {
        "_id": 1,
        "item": "Banana",
        "category": ["food", "produce", "grocery"],
        "location": "4th Street Store",
        "stock": 4,
        "type": "cases"
       }
])

// create an ascending index on item and stock fields
db.products.createIndex({item: 1, stock: 1})
// compound indexes will also use indexes that are prefixes of this

db.events.find().sort( { username: -1, date: 1 } )
// Remember that with a compound index, you can also do the exact opposite but it must match the index prefix


// Multikey indexes
// Multikey indexes are used to index fields that have array values
db.inventory.insertMany([
    { _id: 5, type: "food", item: "aaa", ratings: [ 5, 8, 9 ] },
    { _id: 6, type: "food", item: "bbb", ratings: [ 5, 9 ] },
    { _id: 7, type: "food", item: "ccc", ratings: [ 9, 5, 8 ] },
    { _id: 8, type: "food", item: "ddd", ratings: [ 9, 5 ] },
    { _id: 9, type: "food", item: "eee", ratings: [ 5, 9, 5 ] }
])


db.inventory.createIndex({ratings: 1})

// exact matches
db.inventory.find({ratings: [5,9]})

// $expr doesnt support multikey indexes

db.survey.insertOne(
    { _id: 1, item: "ABC", ratings: [ 2, 5, 9 ] }
)

db.survey.createIndex({ratings: 1})

db.inventory.insertMany([
    {
        _id: 1,
        item: "abc",
        stock: [
          { size: "S", color: "red", quantity: 25 },
          { size: "S", color: "blue", quantity: 10 },
          { size: "M", color: "blue", quantity: 50 }
        ]
      },
      {
        _id: 2,
        item: "def",
        stock: [
          { size: "S", color: "blue", quantity: 20 },
          { size: "M", color: "blue", quantity: 5 },
          { size: "M", color: "black", quantity: 10 },
          { size: "L", color: "red", quantity: 2 }
        ]
      },
      {
        _id: 3,
        item: "ijk",
        stock: [
          { size: "M", color: "blue", quantity: 15 },
          { size: "L", color: "blue", quantity: 100 },
          { size: "L", color: "red", quantity: 25 }
        ]
      }
      
])

db.inventory.createIndex(
    {"stock.size": 1, "stock.quantity": 1}
)

db.inventory.find({"stock.size": "M"})
db.inventroy.find({"stock.size": "S", "stock.quantity": {$gt: 20}})

// Using indexes to sort query results
db.records.createIndex( { a: 1 } )
// sorting can occur in either direction with a single index 

// Sorting on multiple fields
// The pattern must match a prefix or the exact in value for value OR exact inverse


// Geospatial indexes
// 2dsphere indexes
db.places.insertMany( [
    {
       loc : { type: "Point", coordinates: [ -73.97, 40.77 ] },
       name: "Central Park",
       category : "Parks"
    },
    {
       loc : { type: "Point", coordinates: [ -73.88, 40.78 ] },
       name: "La Guardia Airport",
       category : "Airport"
    }
 ] )


db.places.createIndex({loc: "2dsphere"})

db.places.createIndex( { loc : "2dsphere" , category : -1, name: 1 } )
db.places.createIndex( { category : 1 , loc : "2dsphere" } )

// Querying a 2d index
db.places.find( { loc :
    { $geoWithin :
      { $geometry :
        { type : "Polygon" ,
          coordinates : [ [
                            [ 0 , 0 ] ,
                            [ 3 , 6 ] ,
                            [ 6 , 1 ] ,
                            [ 0 , 0 ]
                          ] ]
  } } } } )


//   checking the documents that intersect a specific query with geoIntersects

db.places.find( { loc :
    { $geoIntersects :
      { $geometry :
        { type : "Polygon" ,
          coordinates: [ [
                           [ 0 , 0 ] ,
                           [ 3 , 6 ] ,
                           [ 6 , 1 ] ,
                           [ 0 , 0 ]
                         ] ]
  } } } } )

//   Proximity to a GeoJSON Point
// $near is going to allow you return the closest points and sort the results by distance


// Text indexes
// Allows for you to support search queries on string content. 
db.reviews.createIndex({comments: "text"})

db.reviews.createIndex(
    {
        subject: "text",
        comments: "text"
    }
)

// This is a wildcard text index and this will allow you to do a text search on all string fields
db.collection.createIndex( { "$**": "text" } )

// Hashed indexes
// This type of index is used for hash based sharding
// indexes the value of the field
// Remember that this type of index will support exact matching ONLY
db.collection.createIndex({_id: "hashed"})

db.collection.createIndex( { "fieldA" : 1, "fieldB" : "hashed", "fieldC" : -1 } )
// Remember that you cannot use a hashed index on a multikey index 

// Remember that a using a hashed index on an embedded document will collapse the whole document and hash it.


// Unique constraint with hashed indexes
// Unique constraint with hashed indexes is not supported

// Unique indexes
db.collection.createIndex({name: 1, value: 1}, {unique: true})

// Unique constraint across separate documents
db.sampler.insertMany([
    { _id: 1, a: [ { loc: "A", qty: 5 }, { qty: 10 } ] },
    { _id: 2, a: [ { loc: "A" }, { qty: 5 } ] },
    { _id: 3, a: [ { loc: "A", qty: 10 } ] }

])

db.sampler.createIndex( { "a.loc": 1, "a.qty": 1 }, { unique: true } )

db.sampler.insertOne( { _id: 4, a: [ { loc: "B" }, { loc: "B" } ] } )

db.sampler.insertOne( { _id: 7, a: [ { loc: "A", qty: 10 } ] } ) //so when you provide unqiue key constraint on a multikey index it will not allow same documents even at the one level

// Unique partial indexes
// partialFilterExpression 


// partialIndexes and partialFilterExpression parameter
