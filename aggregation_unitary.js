// The analogy between the aggregation pipeline and UNIX pipes
// Each aggregation stage operator and its semantics
// How documents enter the pipeline, are passed from one stage to another, and are returned when the pipeline completes

db.orders.aggregate( [
    { $match: { status: "urgent" } },
    { $group: { _id: "$productName", sumQuantity: { $sum: "$quantity" } } }
 ] )

//  $match stage
// $match is very similar to find and is used to filter out so only matching documents are returned

// $group stage
// Will group the input by product name and perform a group by
// The $sum is going to aggregate and calculate the total quantity per product name

db.orders.insertMany( [
    { _id: 0, productName: "Steel beam", status: "new", quantity: 10 },
    { _id: 1, productName: "Steel beam", status: "urgent", quantity: 20 },
    { _id: 2, productName: "Steel beam", status: "urgent", quantity: 30 },
    { _id: 3, productName: "Iron rod", status: "new", quantity: 15 },
    { _id: 4, productName: "Iron rod", status: "urgent", quantity: 50 },
    { _id: 5, productName: "Iron rod", status: "urgent", quantity: 10 }
 ] )

 db.orders.aggregate(
     [
         {$match: {status: 'urgent'}},
         {$group: {_id: '$productName', sumQuantity: {$sum: "$quantity"}}}
     ]
 )

//  Aggregation Pipeline Stages and Operations
// Single Purpose Aggregation Operations
db.orders.distinct('cust_id')

// Aggregation Expressions
// field path
// Path to a field in the document. To specify a field path, use a string that prefixes the field name with a dollar sign ($).

// Aggregation Variables
// There are lots of pre-defined aggregation variables you can access them using the $$ operator
$$NOW
// $$NOW will return the current datetime value
$$ROOT //This will reference the root document
$$CURRENT //This will reference the start of the field path

// $match with an example
db.articles.insertMany([
    { "_id" : ObjectId("512bc95fe835e68f199c8686"), "author" : "dave", "score" : 80, "views" : 100 },
{ "_id" : ObjectId("512bc962e835e68f199c8687"), "author" : "dave", "score" : 85, "views" : 521 },
{ "_id" : ObjectId("55f5a192d4bede9ac365b257"), "author" : "ahn", "score" : 60, "views" : 1000 },
{ "_id" : ObjectId("55f5a192d4bede9ac365b258"), "author" : "li", "score" : 55, "views" : 5000 },
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b259"), "author" : "annT", "score" : 60, "views" : 50 },
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b25a"), "author" : "li", "score" : 94, "views" : 999 },
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b25b"), "author" : "ty", "score" : 95, "views" : 1000 }
])

db.articles.aggregate(
    [
        {$match: {author: "dave"}}
    ]
)

db.articles.aggregate([
    {
        $match: {
            author: 'dave'
        }
    }
]
)

// Performing a count
db.articles.aggregate([
    {$match: {
        $or: [
            {
                score: {
                    $gt: 70, 
                    $lt: 90
                }
            },
            {
                views: {
                    $gte: 1000
                }
            }
        ]
    }}
])

db.articles.aggregate([
    {$match: {
        $or: [
            {
                score: {
                    $gt: 70, 
                    $lt: 90
                }
            },
            {
                views: {
                    $gte: 1000
                }
            }
        ]
    }},
    {
        $group: {
            _id: null, count : {
                $sum : 1
            }
        }
    }
])

// $project
db.books.insertOne(
    {
        "_id" : 1,
        title: "abc123",
        isbn: "0001122223334",
        author: { last: "zzz", first: "aaa" },
        copies: 5
      }
)

db.books.aggregate(
    [
        {$project: {
            title: 1, author:1
        }}
    ]
)

db.books.aggregate([
    {
        $project: {
            title: 1, author: 1, _id: 0
        }
    }
]
)

db.books.insertMany([
    {
        "_id" : 1,
        title: "abc123",
        isbn: "0001122223334",
        author: { last: "zzz", first: "aaa" },
        copies: 5,
        lastModified: "2016-07-28"
      }
])

db.books.aggregate([
    {
        $project :{
            'lastModified': 0
        }
    }
])

db.books.insertOne(
{
    "_id" : 1,
    title: "abc123",
    isbn: "0001122223334",
    author: { last: "zzz", first: "aaa" },
    copies: 5,
    lastModified: "2016-07-28"
  })

db.books.aggregate([
    {
        $project: {
            "author.last": 0, "lastModified": 0
        }
    }
])

// Conditionally excluding fields with $project
db.books.insertMany([
{
    "_id" : 1,
    title: "abc123",
    isbn: "0001122223334",
    author: { last: "zzz", first: "aaa" },
    copies: 5,
    lastModified: "2016-07-28"
  },
  {
    "_id" : 2,
    title: "Baked Goods",
    isbn: "9999999999999",
    author: { last: "xyz", first: "abc", middle: "" },
    copies: 2,
    lastModified: "2017-07-21"
  },
  {
    "_id" : 3,
    title: "Ice Cream Cakes",
    isbn: "8888888888888",
    author: { last: "xyz", first: "abc", middle: "mmm" },
    copies: 5,
    lastModified: "2017-07-22"
  }
])


db.books.aggregate([
    {
        $project : {
            title: 1,
            "author.first": 1,
            "author.last":1,
            "author.middle": {
                $cond : {
                    if: {$eq: ["", "$author.middle"]},
                    then: "$$REMOVE",
                    else: "$author.middle"
                }
            }
        }
    }
]
)

// You can compute values in the project stage
db.books.aggregate(
    [
       {
          $project: {
             title: 1,
             isbn: {
                prefix: { $substr: [ "$isbn", 0, 3 ] },
                group: { $substr: [ "$isbn", 3, 2 ] },
                publisher: { $substr: [ "$isbn", 5, 4 ] },
                title: { $substr: [ "$isbn", 9, 3 ] },
                checkDigit: { $substr: [ "$isbn", 12, 1] }
             },
             lastName: "$author.last",
             copiesSold: "$copies"
          }
       }
    ]
 )

//  Project new array fields
db.c1.insertOne(
    { "_id" : ObjectId("55ad167f320c6be244eb3b95"), "x" : 1, "y" : 1 }
)

db.c1.aggregate([
    {
        $project: {
            myArray: ["$x", "$y"]
        }
    }
])

// $addFields