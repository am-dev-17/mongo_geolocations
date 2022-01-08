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
$addFields //This will project all fields and then add the fields that you specify

db.scores.insertMany([
    {
        _id: 1,
        student: "Maya",
        homework: [ 10, 5, 10 ],
        quiz: [ 10, 8 ],
        extraCredit: 0
      },
      {
        _id: 2,
        student: "Ryan",
        homework: [ 5, 6, 5 ],
        quiz: [ 8, 8 ],
        extraCredit: 8
      }
])

db.scores.aggregate([
    {
        $addFields: {
            totalHomework: {$sum: '$homework'},
            totalQuiz: {$sum: "$quiz"}
        }
    },
    {
        $addFields: {
            totalScore: {
                $add: ["$totalHomework", "$totalQuiz", "$extraCredit"]
            }
        }
    }
])

// Add fields to an embedded document
db.vehicles.insertMany([
    { _id: 1, type: "car", specs: { doors: 4, wheels: 4 } },
{ _id: 2, type: "motorcycle", specs: { doors: 0, wheels: 2 } },
{ _id: 3, type: "jet ski" }
])

db.vehicles.aggregate([
    {
        $addFields: {
            "specs.fuel_type": "unleaded"
        }
    }
])

// Overwriting an existing field
db.animals.insertMany([
    { _id: 1, dogs: 10, cats: 15 }
])

db.animals.aggregate([
    {
        $addFields: {
            cats: 20
        }
    }
])

db.fruit.insertMany([
    { "_id" : 1, "item" : "tangerine", "type" : "citrus" },
{ "_id" : 2, "item" : "lemon", "type" : "citrus" },
{ "_id" : 3, "item" : "grapefruit", "type" : "citrus" }
])

// replacing the _id field with the value of item
db.fruit.aggregate([
    {
        $addFields: {
            _id: "$item",
            item: "fruit"
        }
    }
])

// Add element to an array
db.scores.insertMany([
    { _id: 1, student: "Maya", homework: [ 10, 5, 10 ], quiz: [ 10, 8 ], extraCredit: 0 },
    { _id: 2, student: "Ryan", homework: [ 5, 6, 5 ], quiz: [ 8, 8 ], extraCredit: 8 }
 ])


db.scores.aggregate([
    {$match: {_id: 1}},
    {$addFields: {
        homework: {
            $concatArrays: ["$homework", [7]]
        }
    }}
])

// $text performs a text search on the content of the fields indexed with a text index. 
// A $text expression has the following syntax:

db.articles.createIndex( { subject: "text" } )

db.articles.insertMany( [
    { _id: 1, subject: "coffee", author: "xyz", views: 50 },
    { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
    { _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
    { _id: 4, subject: "baking", author: "xyz", views: 100 },
    { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
    { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
    { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
    { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
] )

db.articles.find(
    {$text: {
        $search: "coffee"
    }}
)

// Matching any of the search terms Logical OR is done with spaces
db.articles.find(
    {
        $text: {
            $search: "bake coffee cake"
        }
    }
)

db.articles.find(
    { $text: { $search: "cake" } },
    { score2: { $meta: "textScore" } }
 )

// $sort aggregation
db.restaurants.insertMany( [
    { "_id" : 1, "name" : "Central Park Cafe", "borough" : "Manhattan"},
    { "_id" : 2, "name" : "Rock A Feller Bar and Grill", "borough" : "Queens"},
    { "_id" : 3, "name" : "Empire State Pub", "borough" : "Brooklyn"},
    { "_id" : 4, "name" : "Stan's Pizzaria", "borough" : "Manhattan"},
    { "_id" : 5, "name" : "Jane's Deli", "borough" : "Brooklyn"},
 ] );

 db.restaurants.aggregate([
     {$sort: {borough: 1}}
 ])

 db.restaurants.aggregate([
     {
         $sort: {
             borough: 1, _id: 1
         }
     }
 ])

 db.users.aggregate(
    [
      { $sort : { age : -1, posts: 1 } }
    ]
 )

//  Text Score Metadata Sort
db.users.createIndex({'somefield': "text"})
db.users.aggregate(
    [
        {
            $match: {$text:{$search: "operating"}}
        },
        {
            $sort:{
                score: { 
                    $meta: "textScore"
                },
                posts: -1
            }
        }
    ]
)

// $sort + $limit operator and memory optimization
// If a $sort preceds a $limit and there are no intervening
// states that modify the number of documents, the 
// $limit will be used with the $sort and only the limit n
// number of documents will be stored

// The $sort operator can take advantage of an index if 
// it's used in the first stage of a pipeline or 
// if it's only preceeded by a $match stage.

// $limit aggregation stage
db.article.aggregate([
    { $limit : 5 }
 ]);

//  $skip 
// Skips over the specified number of documents that pass into the stage and passes 
// the remaining documents to the next stage in the pipeline.
db.article.aggregate([
    {$skip: 5}
])

// $redact
db.forecasts.insertMany([
    {
        _id: 1,
        title: "123 Department Report",
        tags: [ "G", "STLW" ],
        year: 2014,
        subsections: [
          {
            subtitle: "Section 1: Overview",
            tags: [ "SI", "G" ],
            content:  "Section 1: This is the content of section 1."
          },
          {
            subtitle: "Section 2: Analysis",
            tags: [ "STLW" ],
            content: "Section 2: This is the content of section 2."
          },
          {
            subtitle: "Section 3: Budgeting",
            tags: [ "TK" ],
            content: {
              text: "Section 3: This is the content of section3.",
              tags: [ "HCS" ]
            }
          }
        ]
      }
])

var userAccess = [ "STLW", "G" ];
db.forecasts.aggregate(
   [
     { $match: { year: 2014 } },
     { $redact: {
        $cond: {
           if: { $gt: [ { $size: { $setIntersection: [ "$tags", userAccess ] } }, 0 ] },
           then: "$$DESCEND",
           else: "$$PRUNE"
         }
       }
     }
   ]
);
// $$DESCEND - Will list the current level document not embedded
// $KEEP - Will the current level and embdedded
// $$PRUNE - EXCLUDES all fields and all lower fields


// Exclude all fields at a given level
db.accounts.insertOne(
    {
        _id: 1,
        level: 1,
        acct_id: "xyz123",
        cc: {
          level: 5,
          type: "yy",
          num: 000000000000,
          exp_date: ISODate("2015-11-01T00:00:00.000Z"),
          billing_addr: {
            level: 5,
            addr1: "123 ABC Street",
            city: "Some City"
          },
          shipping_addr: [
            {
              level: 3,
              addr1: "987 XYZ Ave",
              city: "Some City"
            },
            {
              level: 3,
              addr1: "PO Box 0123",
              city: "Some City"
            }
          ]
        },
        status: "A"
      }
)


db.accounts.aggregate([
    {
        $match: {
            status: "A"
        }
    },
    {
        $redact: {
            $cond: {
                if: {$eq: ["$level", 5]},
                then: "$$PRUNE",
                else: "$$DESCEND"
            }
        }
    }
])

// $group
db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("2"), "date" : ISODate("2014-03-01T08:00:00Z") },
    { "_id" : 2, "item" : "jkl", "price" : NumberDecimal("20"), "quantity" : NumberInt("1"), "date" : ISODate("2014-03-01T09:00:00Z") },
    { "_id" : 3, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" : NumberInt( "10"), "date" : ISODate("2014-03-15T09:00:00Z") },
    { "_id" : 4, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" :  NumberInt("20") , "date" : ISODate("2014-04-04T11:21:39.736Z") },
    { "_id" : 5, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("10") , "date" : ISODate("2014-04-04T21:23:13.331Z") },
    { "_id" : 6, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("5" ) , "date" : ISODate("2015-06-04T05:08:13Z") },
    { "_id" : 7, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("10") , "date" : ISODate("2015-09-10T08:43:00Z") },
    { "_id" : 8, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("5" ) , "date" : ISODate("2016-02-06T20:20:13Z") },
  ])

  db.sales.aggregate( [
    {
      $group: {
         _id: null,
         count: { $count: { } }
      }
    }
  ] )

//   retrieve distinct values
db.sales.aggregate( [ { $group : { _id : "$item" } } ] )

db.sales.aggregate(
    [
        {
            $group: {
                _id: "$item",
                totalSaleAmount: {
                    $sum: {
                        $multiply: ["$price", "$quantity"]
                    }
                }
            }
        },
        {
            $match: { totalSaleAmount: {$gte: 100}}
        }
    ]
)

// Calculate Count, Sum, and Average
db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("2"), "date" : ISODate("2014-03-01T08:00:00Z") },
    { "_id" : 2, "item" : "jkl", "price" : NumberDecimal("20"), "quantity" : NumberInt("1"), "date" : ISODate("2014-03-01T09:00:00Z") },
    { "_id" : 3, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" : NumberInt( "10"), "date" : ISODate("2014-03-15T09:00:00Z") },
    { "_id" : 4, "item" : "xyz", "price" : NumberDecimal("5"), "quantity" :  NumberInt("20") , "date" : ISODate("2014-04-04T11:21:39.736Z") },
    { "_id" : 5, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("10") , "date" : ISODate("2014-04-04T21:23:13.331Z") },
    { "_id" : 6, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("5" ) , "date" : ISODate("2015-06-04T05:08:13Z") },
    { "_id" : 7, "item" : "def", "price" : NumberDecimal("7.5"), "quantity": NumberInt("10") , "date" : ISODate("2015-09-10T08:43:00Z") },
    { "_id" : 8, "item" : "abc", "price" : NumberDecimal("10"), "quantity" : NumberInt("5" ) , "date" : ISODate("2016-02-06T20:20:13Z") },
  ])

//   Grouping by the day of the year
db.sales.aggregate([
    {
        $match: {
            "date": {
                $gte: new ISODate("2014-01-01"),
                $lt: new ISODate("2015-01-01")
            }
        }
    },
    {
        $group : {
            _id: { $dateToString: {format: "%Y-%m-%d", date: "$date"}},
            totalSaleAmount: {$sum: {$multiply: ["$price", "$quantity"]}},
            averageQuantity: {$avg: "$quantity"},
            count: {$sum: 1}
        }
    },
    {
        $sort: {
            totalSaleAmount: -1
        }
    }
])

// Group By null
db.sales.aggregate([
    {
      $group : {
         _id : null,
         totalSaleAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
         averageQuantity: { $avg: "$quantity" },
         count: { $sum: 1 }
      }
    }
   ])


// Pivot Data
db.books.insertMany([
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
  ])

  db.books.aggregate([
    { $group : { _id : "$author", books: { $push: "$title" } } }
  ])

  