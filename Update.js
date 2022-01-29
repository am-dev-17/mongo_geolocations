// Update
// Correctly Use the Save, Update, FindAndModify Commands to mutate existing documents
// Distinguish which parameter finds the documents to change, which mutates them
// Explain the behavior of any update operator with which you are presented
// Recognize when upserts and db.collection.save() will insert documents

db.collection.update()
// This will update unless upsert: true is specified and the query matches no documents.


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

// Update multiple documnents with $update and multi
db.books.update(
    {stock : {$lte: 10}},
    {$set: {reorder: true}},
    {multi: true}
    )

db.books.update()


db.books.update(
    { _id: 2 },
    {
      $push: { ratings: { "by" : "jkl", "rating" : 2 } }
    }
 )

//  {
//     "_id" : 2,
//     "item" : "XYZ123",
//     "stock" : 15,
//     "info" : {
//      "publisher" : "5555",
//      "pages" : 150
//     },
//     "tags" : [ ],
//     "ratings" : [
//      { "by" : "xyz", "rating" : 5 },
//      { "by" : "jkl", "rating" : 2 }
//     ],
//     "reorder" : false
//    }

db.members.insertMany( [
    { "_id" : 1, "member" : "abc123", "status" : "A", "points" : 2, "misc1" : "note to self: confirm status", "misc2" : "Need to activate", "lastUpdate" : ISODate("2019-01-01T00:00:00Z") },
    { "_id" : 2, "member" : "xyz123", "status" : "A", "points" : 60, "misc1" : "reminder: ping me at 100pts", "misc2" : "Some random comment", "lastUpdate" : ISODate("2019-01-01T00:00:00Z") }
 ] )

 db.members.update(
    { },
    [
       { $set: { status: "Modified", comments: [ "$misc1", "$misc2" ], lastUpdate: "$$NOW" } },
       { $unset: [ "misc1", "misc2" ] }
    ],
    { multi: true }
 )


 db.students3.insertMany( [
    { "_id" : 1, "tests" : [ 95, 92, 90 ], "lastUpdate" : ISODate("2019-01-01T00:00:00Z") },
    { "_id" : 2, "tests" : [ 94, 88, 90 ], "lastUpdate" : ISODate("2019-01-01T00:00:00Z") },
    { "_id" : 3, "tests" : [ 70, 75, 82 ], "lastUpdate" : ISODate("2019-01-01T00:00:00Z") }
 ] )

//  
db.students3.update(
    { },
    [
      { $set: { average : { $trunc: [ { $avg: "$tests" }, 0 ] }, lastUpdate: "$$NOW" } },
      { $set: { grade: { $switch: {
                            branches: [
                                { case: { $gte: [ "$average", 90 ] }, then: "A" },
                                { case: { $gte: [ "$average", 80 ] }, then: "B" },
                                { case: { $gte: [ "$average", 70 ] }, then: "C" },
                                { case: { $gte: [ "$average", 60 ] }, then: "D" }
                            ],
                            default: "F"
      } } } }
    ],
    { multi: true }
 )


 db.inventory.insertMany( [
    { item: "canvas", qty: 100, size: { h: 28, w: 35.5, uom: "cm" }, status: "A" },
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "mat", qty: 85, size: { h: 27.9, w: 35.5, uom: "cm" }, status: "A" },
    { item: "mousepad", qty: 25, size: { h: 19, w: 22.85, uom: "cm" }, status: "P" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
    { item: "sketchbook", qty: 80, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "sketch pad", qty: 95, size: { h: 22.85, w: 30.5, uom: "cm" }, status: "A" }
 ] );

 db.inventory.updateOne(
    { item: "paper" },
    {
      $set: { "size.uom": "cm", status: "P" },
      $currentDate: { lastModified: true }
    }
 )

//  $set
// The $set operator is going to modify the documents based on the update

db.products.insertOne(
    {
      _id: 100,
      quantity: 250,
      instock: true,
      reorder: false,
      details: { model: "14QQ", make: "Clothes Corp" },
      tags: [ "apparel", "clothing" ],
      ratings: [ { by: "Customer007", rating: 4 } ]
    }
 )

 db.products.updateOne(
    { _id: 100 },
    { $set:
       {
         quantity: 500,
         details: { model: "2600", make: "Fashionaires" },
         tags: [ "coats", "outerwear", "clothing" ]
       }
    }
 )

 db.products.updateOne(
    { _id: 100 },
    { $set: { "details.make": "Kustom Kidz" } }
 )

//  Set Elements in Arrays
db.products.updateOne(
    { _id: 100 },
    { $set:
       {
         "tags.1": "rain gear",
         "ratings.0.rating": 2
       }
    }
 )

//  $unset
db.products.insertMany( [
    { "item": "chisel", "sku": "C001", "quantity": 4, "instock": true },
    { "item": "hammer", "sku": "unknown", "quantity": 3, "instock": true },
    { "item": "nails", "sku": "unknown", "quantity": 100, "instock": true }
 ] )

 db.products.updateOne(
    { sku: "unknown" },
    { $unset: { quantity: "", instock: "" } }
 )

//  $rename
db.students.updateOne(
    { _id: 1 },
    { $rename: { 'nickname': 'alias', 'cell': 'mobile' } }
 )

 db.students.updateOne( { _id: 1 }, { $rename: { "name.first": "name.fname" } } )

 db.students.updateOne( { _id: 1 }, { $rename: { 'wife': 'spouse' } } )

//  $setOnInsert
// The $setOnInsert is going to allow us to insert a value on an upsert
db.products.updateOne(
    { _id: 1 },
    {
       $set: { item: "apple" },
       $setOnInsert: { defaultQty: 100 }
    },
    { upsert: true }
  )

//   { "_id" : 1, "item" : "apple", "defaultQty" : 100 }


db.products.insertOne(
    {
      _id: 1,
      sku: "abc123",
      quantity: 10,
      metrics: { orders: 2, ratings: 3.5 }
    }
 )

 db.products.updateOne(
    { sku: "abc123" },
    { $inc: { quantity: -2, "metrics.orders": 1 } }
 )

 db.products.insertOne(
    { "_id" : 1, "item" : "Hats", "price" : Decimal128("10.99"), "quantity" : 25 }
 )

// 
db.products.updateOne(
    { _id: 1 },
    { $mul:
       {
          price: Decimal128( "1.25" ),
          quantity: 2
        }
    }
 )

//  
// { _id: 1, item: 'Hats', price: Decimal128("13.7375"), quantity: 50 }

db.products.insertOne( { _id: 2,  item: "Unknown" } )

db.products.updateOne(
    { _id: 2 },
    { $mul: { price: Decimal128("100") } }
 )

//  { "_id" : 2, "item" : "Unknown", "price" : NumberLong(0) }

db.scores.updateOne( { _id: 1 }, { $min: { lowScore: 150 } } )

db.tags.insertOne(
    {
      _id: 1,
      desc: "crafts",
      dateEntered: ISODate("2013-10-01T05:00:00Z"),
      dateExpired: ISODate("2013-10-01T16:38:16Z")
    }
 )

 db.tags.updateOne(
    { _id: 1 },
    { $min: { dateEntered: new Date("2013-09-25") } }
 )

//  The positional $ operator for arrays
// The positional $ operator identifies an element in an array to update without explicitly specifying the position of the element in the array.
db.students.insertMany( [
    { "_id" : 1, "grades" : [ 85, 80, 80 ] },
    { "_id" : 2, "grades" : [ 88, 90, 92 ] },
    { "_id" : 3, "grades" : [ 85, 100, 90 ] }
 ] )

 db.students.updateOne(
    { _id: 1, grades: 80 },
    { $set: { "grades.$" : 82 } }
 )

//  Update documents in an array
db.students.insertMany([
    {
        _id: 4,
        grades: [
           { grade: 80, mean: 75, std: 8 },
           { grade: 85, mean: 90, std: 5 },
           { grade: 85, mean: 85, std: 8 }
        ]
      }
])

db.students.updateOne(
    { _id: 4, "grades.grade": 85 },
    { $set: { "grades.$.std" : 6 } }
 )

//  {
//     "_id" : 4,
//     "grades" : [
//        { "grade" : 80, "mean" : 75, "std" : 8 },
//        { "grade" : 85, "mean" : 90, "std" : 6 },
//        { "grade" : 85, "mean" : 85, "std" : 8 }
//     ]
//  }

// Update Embedded Documents Using Multiple Field Matches

db.students.updateOne(
    {
      _id: 5,
      grades: { $elemMatch: { grade: { $lte: 90 }, mean: { $gt: 80 } } }
    },
    { $set: { "grades.$.std" : 6 } }
 )

//  $addToSet documentation 
// Add this item to the set
db.inventory.insertOne(
    { _id: 1, item: "polarizing_filter", tags: [ "electronics", "camera" ] }
 )

 db.inventory.updateOne(
    { _id: 1 },
    { $addToSet: { tags: "accessories" } }
 )

//  
db.inventory.updateOne(
    { _id: 1 },
    { $addToSet: { tags: "camera"  } }
 )


//  $each operator with the $addToSet
// { _id: 2, item: "cable", tags: [ "electronics", "supplies" ] }

db.inventory.updateOne(
    { _id: 2 },
    { $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
  )

//   The $each modifier is available for use with the $addToSet operator and the $push operator.
db.students.updateOne(
    { name: "joe" },
    { $push: { scores: { $each: [ 90, 92, 85 ] } } }
 )

//  
// { _id: 2, item: "cable", tags: [ "electronics", "supplies" ] }

db.inventory.updateOne(
    { _id: 2 },
    { $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
  )
//   

// $pop
// $removes the first or last element of an array
db.students.insertOne( { _id: 1, scores: [ 8, 9, 10 ] } )

db.students.updateOne( { _id: 1 }, { $pop: { scores: -1 } } )


// The $pull operator removes from an existing array all instances of a value or values that match a specified condition.

db.stores.insertMany( [
    {
       _id: 1,
       fruits: [ "apples", "pears", "oranges", "grapes", "bananas" ],
       vegetables: [ "carrots", "celery", "squash", "carrots" ]
    },
    {
       _id: 2,
       fruits: [ "plums", "kiwis", "oranges", "bananas", "apples" ],
       vegetables: [ "broccoli", "zucchini", "carrots", "onions" ]
    }
 ] )

//  
db.stores.updateMany(
    { },
    { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } }
)

db.profiles.updateOne( { _id: 1 }, { $pull: { votes: { $gte: 6 } } } )

db.survey.updateMany(
    { },
    { $pull: { results: { score: 8 , item: "B" } } }
  )

//   Comparision operators with reads
// $eq and $neq
// $gt $lt
// $gte $lte

db.trips.find({
    "tripduration": {
        $lte: 70
    }
})

db.trips.find({
    tripduration: {
        $lte: 70
    },
    usertype: {
        $ne : "Subscriber"
    }
})

// Logical Operators
// $and $or $nor $not
db.trips.find({
    $or : [
        {result: "No violation Issued"},
        {result: "Violation Issued"}
    ]
})

// Expressive Query Operator $expr
// $expr allows us to use variables and conditional statements
// What if we want to compare fields within the same document to each other? This is where expr comes in
db.trips.find({
    $expr :{
        "$eq": [
            "$start_station_id", "$end_station_id"
        ]
    }
})


db.trips.find({
    $expr :{
        "$eq": [
            "$start_station_id", "$end_station_id"
        ]
    }
})

// $exists and $type
db.ratings.find({
    mpaaRating: {
        $exists: true 
    }
})

db.ratings.find({
    mpaaRating: {
        $exists: false 
    }
})


// $type
db.rating.find({
    viewerRating : {
        $type: "int"
    }
}).pretty()


// Regex operators
// Array Operators

db.airbnb.amenities.find({
    "amenities":"shampoo" 
})

// Iterating a cursor in mongosh
db.collection.find()

var myCursor = db.users.find({type: 2})
myCursor 

var myCursor = db.users.find( { type: 2 } );
while (myCursor.hasNext()) {
   print(tojson(myCursor.next()));
}

// Update array operators
// $pullAll
// { $pullAll: { <field1>: [ <value1>, <value2> ... ], ... } }
db.survey.insertOne( { _id: 1, scores: [ 0, 2, 5, 5, 1, 0 ] } )

db.survey.update(
    {_id: 1},
    { 
        $pullAll : {
            scores: [0,5]
        }
    }
)

// Array $push operator
// $push is going to append a specified value to an array

db.students.insertOne( { _id: 1, scores: [ 44, 78, 38, 80 ] } )

db.students.updateOne(
    {_id: 1},
    {$push: {scores: 89}}
)

// Append multiple values to an array
db.students.updateOne(
    {_id: 1},
    {
        $push: {
            scores: {$each : [90,92,85]}
        }
    }
)

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
    { _id: 5 },
    {
      $push: {
        quizzes: {
           $each: [ { wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 } ],
           $sort: { score: -1 },
           $slice: 3
        }
      }
    }
 )

//  

// {
//     "_id" : 5,
//     "quizzes" : [
//        { "wk" : 1, "score" : 10 },
//        { "wk" : 2, "score" : 8 },
//        { "wk" : 5, "score" : 8 }
//     ]
//   }


// $each operator is going to allow you to push multiple items into the array
db.students.insertOne(
    { "_id" : 1, "scores" : [ 40, 50, 60 ] }
)

db.students.updateOne(
    {_id: 1},
    {
        $push : {
            scores: {
                $each: [80,78,86],
                $slice: -1
            }
        }
    }
)

// { "_id" : 1, "scores" : [  50,  60,  80,  78,  86 ] }

db.students.updateOne(
    { _id: 2 },
    {
      $push: {
        scores: {
          $each: [ 100, 20 ],
          $slice: 3
        }
      }
    }
 )


 db.students.updateOne(
    { _id: 3 },
    {
      $push: {
        scores: {
           $each: [ ],
           $slice: -3
        }
      }
    }
  )

//   

