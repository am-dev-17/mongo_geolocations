// Aggregations
// An aggregation pipeline consists of one or more stages that process documents
// Each stage will perform an operation on the input documents
db.orders.insertMany( [
    { _id: 0, productName: "Steel beam", status: "new", quantity: 10 },
    { _id: 1, productName: "Steel beam", status: "urgent", quantity: 20 },
    { _id: 2, productName: "Steel beam", status: "urgent", quantity: 30 },
    { _id: 3, productName: "Iron rod", status: "new", quantity: 15 },
    { _id: 4, productName: "Iron rod", status: "urgent", quantity: 50 },
    { _id: 5, productName: "Iron rod", status: "urgent", quantity: 10 }
 ] )

 db.orders.aggregate([
     {$match: { status: "urgent"}},
     {$group: {_id: "$productName", sumQuantity: {$sum: "$quantity"}}}
 ])


//  The $match stage can use an index to filter documents if it occurs at the beginning of the pipeline
// The $sort stage can use an index long as it is not preceded by  a $project, $unwind, or $group operator
// $group stage can use an index to find the first document in each if all of the following criteria are met
// The $group stage is preceded by a $sort stage that sorts the field to group by,
// If your aggregation operation requires only a subset of the data in a collection, use the $match, $limit, and $skip stages to restrict the documents that enter at the beginning of the pipeline. When placed at the beginning of a pipeline, $match operations use suitable indexes to scan only the matching documents in a collection.


// The Single Purpose Aggregation Operations
// $match is going to function just like the find operation and will allow for you to specify query criteria
db.collection.aggregate([
    {
        $math: {
            _id : 134567
        }
    }
])

db.articles.insertMany([
    { "_id" : ObjectId("512bc95fe835e68f199c8686"), "author" : "dave", "score" : 80, "views" : 100 },
{ "_id" : ObjectId("512bc962e835e68f199c8687"), "author" : "dave", "score" : 85, "views" : 521 },
{ "_id" : ObjectId("55f5a192d4bede9ac365b257"), "author" : "ahn", "score" : 60, "views" : 1000 },
{ "_id" : ObjectId("55f5a192d4bede9ac365b258"), "author" : "li", "score" : 55, "views" : 5000 },
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b259"), "author" : "annT", "score" : 60, "views" : 50 },
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b25a"), "author" : "li", "score" : 94, "views" : 999 },
{ "_id" : ObjectId("55f5a1d3d4bede9ac365b25b"), "author" : "ty", "score" : 95, "views" : 1000 }
])

db.articles.aggregate([
    {$match: {
        author: "dave"
    }}
]
)

// Performing a count
db.articles.aggregate([
    {
        $match: {
            $or: [
                {score : {$gt: 70, $lt: 90}}, {views: {$gte: 1000}}
            ]
        }
    },
    {
        $group: {_id: null, count: {$sum:1}}
    }
])

// $project operator is going to allow you to project and decide if you need to project new or remove other fields
db.books.drop()

db.books.insertOne(
    {
        "_id" : 1,
        title: "abc123",
        isbn: "0001122223334",
        author: { last: "zzz", first: "aaa" },
        copies: 5
      }
)

db.books.aggregate([
    {
        $project: {
            title: 1, author: 1
        }
    }
])

// { "_id" : 1, "title" : "abc123", "author" : { "last" : "zzz", "first" : "aaa" } }

// supressing the _id field

db.books.aggregate([
    {
        $project: {
            _id: 0
        }
    }
])

db.books.aggregate( [ { $project : { "author.first" : 0, "lastModified" : 0 } } ] )

// Conditionally exclude fields
db.books.drop()
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

db.books.aggregate( [
    {
       $project: {
          title: 1,
          "author.first": 1,
          "author.last" : 1,
          "author.middle": {
             $cond: {
                if: { $eq: [ "", "$author.middle" ] },
                then: "$$REMOVE",
                else: "$author.middle"
             }
          }
       }
    }
 ] )

//  { "_id" : 1, "title" : "abc123", "author" : { "last" : "zzz", "first" : "aaa" } }
// { "_id" : 2, "title" : "Baked Goods", "author" : { "last" : "xyz", "first" : "abc" } }
// { "_id" : 3, "title" : "Ice Cream Cakes", "author" : { "last" : "xyz", "first" : "abc", "middle" : "mmm" } }

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

//  {
//     "_id" : 1,
//     "title" : "abc123",
//     "isbn" : {
//        "prefix" : "000",
//        "group" : "11",
//        "publisher" : "2222",
//        "title" : "333",
//        "checkDigit" : "4"
//     },
//     "lastName" : "zzz",
//     "copiesSold" : 5
//  }

db.coll12.insertOne({ "_id" : ObjectId("55ad167f320c6be244eb3b95"), "x" : 1, "y" : 1 })

db.coll12.aggregate([
    {$project: {myArray: ["$x", "$y"]}}
])

db.collection.aggregate( [ { $project: { myArray: [ "$x", "$y", "$someField" ] } } ] )

// $addFields
// The fields is going to addFields (obv)
// { $addFields: { <newField>: <expression>, ... } }
// $addFields appends new fields to existing documents. You can include one or more $addFields stages in an aggregation operation.

db.scores.drop()
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
            totalHomework: {$sum: "$homework"},
            totalQuiz: {$sum: "$quiz"}
        }
    }
])

db.scores.aggregate([
    {
        $addFields: {
            totalHomework: {$sum: "$homework"},
            totalQuiz: {$sum: "$quiz"}
        }
    },
    {
        $addFields: {
            totalScore: {$add: ["$totalHomework", "$totalQuiz", "$extraCredit"]}
        }
    }
])

// Adding an element to an array
db.scores.aggregate([
    {$match: {_id: 1}},
    {$addFields: {
        homework: {$concatArrays: ["$homework", [7]]}
    }}
])

// $text operator
// $text will perform a text search on the content of the fields indexed with text index.
// {
//     $text:
//       {
//         $search: <string>,
//         $language: <string>,
//         $caseSensitive: <boolean>,
//         $diacriticSensitive: <boolean>
//       }
//   }

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

// Searching for a single word
db.articles.find( { $text: { $search: "coffee" } } )
db.articles.find({$text: {$search: "coffee"}})

db.articles.createIndex( { subject: "text" } )

db.articles.aggregate([
    {
        $match: {
            $text: {
                $search: "cake"
            }
        }
    },
    {
        $group: {
            _id: null, views : {$sum: "$views"}
        }
    }
])

db.articles.aggregate(
    [
      { $match: { $text: { $search: "cake tea" } } },
      { $sort: { score: { $meta: "textScore" } } },
      { $project: { title: 1, _id: 0 } }
    ]
 )

 db.articles.aggregate(
    [
      { $match: { $text: { $search: "cake tea" } } },
      { $project: { title: 1, _id: 0, score: { $meta: "textScore" } } },
      { $match: { score: { $gt: 1.0 } } }
    ]
 )

 db.articles.aggregate(
    [
      { $match: { $text: { $search: "saber -claro", $language: "es" } } },
      { $group: { _id: null, views: { $sum: "$views" } } }
    ]
 )

//  $sort 
db.articles.aggregate([
    {
        sort: {f1: 1, f2: 1}
    }
])

// { $meta: "textScore" }

db.restaurants.insertMany( [
    { "_id" : 1, "name" : "Central Park Cafe", "borough" : "Manhattan"},
    { "_id" : 2, "name" : "Rock A Feller Bar and Grill", "borough" : "Queens"},
    { "_id" : 3, "name" : "Empire State Pub", "borough" : "Brooklyn"},
    { "_id" : 4, "name" : "Stan's Pizzaria", "borough" : "Manhattan"},
    { "_id" : 5, "name" : "Jane's Deli", "borough" : "Brooklyn"},
 ] );

 db.restaurants.drop()

 db.restaurants.aggregate([
     {$sort: {borough: 1}}
 ])

 db.restaurants.aggregate(
    [
      { $sort : { borough : 1, _id: 1 } }
    ]
 )

 db.users.aggregate(
    [
      { $sort : { age : -1, posts: 1 } }
    ]
 )

 db.users.aggregate(
    [
      { $match: { $text: { $search: "operating" } } },
      { $sort: { score: { $meta: "textScore" }, posts: -1 } }
    ]
 )

 db.users.aggregate(
    [
      { $match: { $text: { $search: "operating" } } },
      { $sort: { score: { $meta: "textScore" }, posts: -1 } }
    ]
 )

//  $sort + $limit Memory Optimization
// When a $sort precedes a $limit and there are no intervening stages that modify the number of documents, the optimizer can coalesce the $limit into the $sort. This allows the $sort operation to only maintain the top n results as it progresses
// Remember that sort has a 100MB limit of RAM for in-memory sorts IF IT EXCEEDS BY DEFAULT IT WILL ERROR OUT

// The $sort operator can take advantage of an index if it's used in the first stage of a pipeline or if it's only preceeded by a $match stage.
// When you use the $sort on a sharded cluster, each shard sorts its result documents using an index where available. Then the mongos or one of the shards performs a streamed merge sort.
// $limit the limit stage does exactly what you think

db.article.aggregate([
    {$limit: 5}
])
// be sure to include at least one field in your sort that contains unique values, before passing results to the $skip stage.
db.article.aggregate([
    { $skip : 5 }
]);

// $redact is going to allow you to redact certain confidential data based on conditions
// $$DESCEND, $$PRUNE , $$KEEP
// $$DESCEND -> This will redact at the current field and decide for that field ONLY
// $$PRUNE -> This will redact at the current field AND ALL EMBEDDED FIELDS
// $$KEEP THIS  will keep the current field and all embedded fields


db.forecasts.drop()

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

db.accounts.aggregate(
    [
      { $match: { status: "A" } },
      {
        $redact: {
          $cond: {
            if: { $eq: [ "$level", 5 ] },
            then: "$$PRUNE",
            else: "$$DESCEND"
          }
        }
      }
    ]
  );

//   $group operator
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

  db.sales.drop()
//   
db.sales.aggregate([
    {
        $group: {
            _id: null,
            count: {$count: {}}
        }
    }
])

db.sales.aggregate( [ { $group : { _id : "$item" } } ] )

// Group by Item Having
db.sales.aggregate([
    {
        $group: {
            _id: "$item",
            totalSaleAmount: {$sum: {$multiply: ["$price", "$quantity"]}}
        }
    },
    {
        $match: {
            "totalSaleAmount": {$gte: 100}
        }
    }
])

db.sales.aggregate([
    // First Stage
    {
      $match : { "date": { $gte: new ISODate("2014-01-01"), $lt: new ISODate("2015-01-01") } }
    },
    // Second Stage
    {
      $group : {
         _id : { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
         totalSaleAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
         averageQuantity: { $avg: "$quantity" },
         count: { $sum: 1 }
      }
    },
    // Third Stage
    {
      $sort : { totalSaleAmount: -1 }
    }
   ])

//    
