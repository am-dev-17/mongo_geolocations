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

//    $unwind operator
// { $unwind: <field path> }
// {
//     $unwind:
//       {
//         path: <field path>,
//         includeArrayIndex: <string>,
//         preserveNullAndEmptyArrays: <boolean>
//       }
//   }

// $unwind stage no longer errors on non-array operand
db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })

db.inventory.drop()

db.inventory.aggregate([
    {
        $unwind : "$sizes"
    }
])

db.inventory2.insertMany([
    { "_id" : 1, "item" : "ABC", price: NumberDecimal("80"), "sizes": [ "S", "M", "L"] },
    { "_id" : 2, "item" : "EFG", price: NumberDecimal("120"), "sizes" : [ ] },
    { "_id" : 3, "item" : "IJK", price: NumberDecimal("160"), "sizes": "M" },
    { "_id" : 4, "item" : "LMN" , price: NumberDecimal("10") },
    { "_id" : 5, "item" : "XYZ", price: NumberDecimal("5.75"), "sizes" : null }
  ])

  db.inventory2.drop()

//   
db.inventory2.aggregate([
    {$unwind: "$sizes"}
])

db.inventory2.aggregate([
    {$unwind: {path: "$sizes"}}
])

// { "_id" : 1, "item" : "ABC", "price" : NumberDecimal("80"), "sizes" : "S" }
// { "_id" : 1, "item" : "ABC", "price" : NumberDecimal("80"), "sizes" : "M" }
// { "_id" : 1, "item" : "ABC", "price" : NumberDecimal("80"), "sizes" : "L" }
// { "_id" : 3, "item" : "IJK", "price" : NumberDecimal("160"), "sizes" : "M" }

db.inventory2.aggregate( [
    {
      $unwind:
        {
          path: "$sizes",
          includeArrayIndex: "arrayIndex"
        }
     }])

    //  
// 
// { "_id" : 1, "item" : "ABC", "price" : NumberDecimal("80"), "sizes" : "S" }
// { "_id" : 1, "item" : "ABC", "price" : NumberDecimal("80"), "sizes" : "M" }
// { "_id" : 1, "item" : "ABC", "price" : NumberDecimal("80"), "sizes" : "L" }
// { "_id" : 2, "item" : "EFG", "price" : NumberDecimal("120") }
// { "_id" : 3, "item" : "IJK", "price" : NumberDecimal("160"), "sizes" : "M" }
// { "_id" : 4, "item" : "LMN", "price" : NumberDecimal("10") }
// { "_id" : 5, "item" : "XYZ", "price" : NumberDecimal("5.75"), "sizes" : null }

// Group by the unwound values
db.inventory2.aggregate([
    {
        $unwind: {
            path: "$sizes"
        }
    },{
        $group: {
            _id: "$sizes", 
            totalPrice: {
                $sum: "$price"
            }
        }
    }

])

db.inventory2.aggregate( [
    // First Stage
    {
      $unwind: { path: "$sizes", preserveNullAndEmptyArrays: true }
    },
    // Second Stage
    {
      $group:
        {
          _id: "$sizes",
          averagePrice: { $avg: "$price" }
        }
    },
    // Third Stage
    {
      $sort: { "averagePrice": -1 }
    }
 ] )

//  $out operator
// Takes the documents returned by the aggregation pipeline and writes them to a specified collection. Starting in MongoDB 4.4, you can specify the output database.

// { $out: { db: "<output-db>", coll: "<output-collection>" } }
// With $out we cannot specify a sharded collection as the output collection

// Comparing $out with $merge
// $out will replace the collection completely if the collection already exists
// $out cannot output to a sharded collection

db.getSiblingDB("test").books.insertMany([
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
 ])

 db.getSiblingDB("test").books.aggregate([
     {
         $group: {
             _id: "$author", books: {$push: "$title"}
         }
     },
     {
         $out: "authors"
     }
 ])


db.getSiblingDB("test").books.drop()
db.authors.drop()

db.getSiblingDB("test").books.aggregate( [
    { $group : { _id : "$author", books: { $push: "$title" } } },
    { $out : { db: "reporting", coll: "authors" } }
] )

// $sample
// The $sample operator is going to allow us to sample
// If all of the following conditions are true, $sample uses a pseudo-random cursor to select the N documents:
// $sample is the first stage of the pipeline.
// N is less than 5% of the total documents in the collection.
// The collection contains more than 100 documents.

db.users.insertMany([
    { "_id" : 1, "name" : "dave123", "q1" : true, "q2" : true },
{ "_id" : 2, "name" : "dave2", "q1" : false, "q2" : false  },
{ "_id" : 3, "name" : "ahn", "q1" : true, "q2" : true  },
{ "_id" : 4, "name" : "li", "q1" : true, "q2" : false  },
{ "_id" : 5, "name" : "annT", "q1" : false, "q2" : true  },
{ "_id" : 6, "name" : "li", "q1" : true, "q2" : true  },
{ "_id" : 7, "name" : "ty", "q1" : false, "q2" : true  }
])

db.users.aggregate([
    {$sample: {size: 3}}
])

// $geoNear
// { $geoNear: { <geoNear options> } }
db.places.insertMany( [
    {
       name: "Central Park",
       location: { type: "Point", coordinates: [ -73.97, 40.77 ] },
       category: "Parks"
    },
    {
       name: "Sara D. Roosevelt Park",
       location: { type: "Point", coordinates: [ -73.9928, 40.7193 ] },
       category: "Parks"
    },
    {
       name: "Polo Grounds",
       location: { type: "Point", coordinates: [ -73.9375, 40.8303 ] },
       category: "Stadiums"
    }
 ] )

 db.places.drop()

 db.places.createIndex({location: "2dsphere"})

 db.places.aggregate([
     {
         $geoNear: {
             near : {type: "Point", coordinates: [-73.99279 , 40.719296]},
             distanceField : "dist.calculated",
             maxDistance: 2,
             query: {category: "Parks"},
             includeLocs: "dist.location", 
             spherical :true
         }
     }
 ]).pretty()

//  Specify a minium distance
db.places.aggregate([
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ -73.99279 , 40.719296 ] },
         distanceField: "dist.calculated",
         minDistance: 2,
         query: { category: "Parks" },
         includeLocs: "dist.location",
         spherical: true
      }
    }
 ])

//  specify which geospatial index to use 
// {
//     "_id" : 3,
//     "name" : "Polo Grounds",
//     "location": {
//        "type" : "Point",
//        "coordinates" : [ -73.9375, 40.8303 ]
//     },
//     "legacy" : [ -73.9375, 40.8303 ],
//     "category" : "Stadiums"
//  }

db.places.aggregate([
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ -73.98142 , 40.71782 ] },
         key: "location",
         distanceField: "dist.calculated",
         query: { "category": "Parks" }
      }
    },
    { $limit: 5 }
 ])

 db.places.aggregate([
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ -73.98142 , 40.71782 ] },
         key: "location",
         distanceField: "dist.calculated",
         query: { "category": "Parks" }
      }
    },
    { $limit: 5 }
 ])

// $lookup this is going to function just like a join
// {
//     $lookup:
//       {
//         from: <collection to join>,
//         localField: <field from the input documents>,
//         foreignField: <field from the documents of the "from" collection>,
//         as: <output array field>
//       }
//  }


db.orders.drop()
db.orders.insertMany( [
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
    { "_id" : 3  }
 ] )


db.inventory.drop()

 db.inventory.insertMany( [
    { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
    { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
    { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
    { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
    { "_id" : 5, "sku": null, "description": "Incomplete" },
    { "_id" : 6 }
 ] )

 db.orders.aggregate([
     {
         $lookup :{
            from: "inventory", 
            localField: "item",
            foreignField: "sku",
            as: "inventory_docs"
         }
     }
 ]).pretty()

//  {
//     "_id" : 1,
//     "item" : "almonds",
//     "price" : 12,
//     "quantity" : 2,
//     "inventory_docs" : [
//        { "_id" : 1, "sku" : "almonds", "description" : "product 1", "instock" : 120 }
//     ]
//  }
//  {
//     "_id" : 2,
//     "item" : "pecans",
//     "price" : 20,
//     "quantity" : 1,
//     "inventory_docs" : [
//        { "_id" : 4, "sku" : "pecans", "description" : "product 4", "instock" : 70 }
//     ]
//  }
//  {
//     "_id" : 3,
//     "inventory_docs" : [
//        { "_id" : 5, "sku" : null, "description" : "Incomplete" },
//        { "_id" : 6 }
//     ]
//  }


// Using $lookup with an Array
db.classes.insertMany( [
    { _id: 1, title: "Reading is ...", enrollmentlist: [ "giraffe2", "pandabear", "artie" ], days: ["M", "W", "F"] },
    { _id: 2, title: "But Writing ...", enrollmentlist: [ "giraffe1", "artie" ], days: ["T", "F"] }
 ] )

 db.classes.drop()

 db.members.insertMany( [
    { _id: 1, name: "artie", joined: new Date("2016-05-01"), status: "A" },
    { _id: 2, name: "giraffe", joined: new Date("2017-05-01"), status: "D" },
    { _id: 3, name: "giraffe1", joined: new Date("2017-10-01"), status: "A" },
    { _id: 4, name: "panda", joined: new Date("2018-10-11"), status: "A" },
    { _id: 5, name: "pandabear", joined: new Date("2018-12-01"), status: "A" },
    { _id: 6, name: "giraffe2", joined: new Date("2018-12-01"), status: "D" }
 ] )

//  
db.classes.aggregate([
    {
        $lookup: {
            from: "members",
            localField: "enrollmentlist",
            foreignField: "name",
            as: "enrollee_info"
        }
    }
]).pretty()

// using $lookup and $mergeObjects
db.orders.drop()
db.orders.insertMany( [
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 }
 ] )



db.items.drop()
db.items.insertMany( [
    { "_id" : 1, "item" : "almonds", description: "almond clusters", "instock" : 120 },
    { "_id" : 2, "item" : "bread", description: "raisin and nut bread", "instock" : 80 },
    { "_id" : 3, "item" : "pecans", description: "candied pecans", "instock" : 60 }
  ] )


  db.orders.aggregate( [
    {
       $lookup: {
          from: "items",
          localField: "item",    // field in the orders collection
          foreignField: "item",  // field in the items collection
          as: "fromItems"
       }
    },
    {
       $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fromItems", 0 ] }, "$$ROOT" ] } }
    },
    { $project: { fromItems: 0 } }
 ] )


//  count
db.scores.aggregate(
    [
      {
        $match: {
          score: {
            $gt: 80
          }
        }
      },
      {
        $count: "passing_scores"
      }
    ]
  )
  //{ "passing_scores" : 4 }
// 

// replaceRoot
// Replaces the input document with the specified document. The replaceRoot operation will replace ALL EXISTING FIELDS in the input document
// including _id field

// { $replaceRoot: { newRoot: <replacementDocument> } }
db.collection.drop()
db.collection.insertMany([
    { "_id": 1, "name" : { "first" : "John", "last" : "Backus" } },
    { "_id": 2, "name" : { "first" : "John", "last" : "McCarthy" } },
    { "_id": 3, "name": { "first" : "Grace", "last" : "Hopper" } },
    { "_id": 4, "firstname": "Ole-Johan", "lastname" : "Dahl" },
 ])

 db.collection.aggregate([
     {$replaceRoot: {
         newRoot: "$name" //because one of the documents does not have the name field it will fail
     }}
 ])


//  So we want to avoid this error how can we do it?
db.collection.aggregate([
    { $match: { name : { $exists: true, $not: { $type: "array" }, $type: "object" } } },
    { $replaceRoot: { newRoot: "$name" } }
 ])

//  Performing $replaceRoot with an embedded document

// { "_id" : 1, "name" : "Arlene", "age" : 34, "pets" : { "dogs" : 2, "cats" : 1 } }
// { "_id" : 2, "name" : "Sam", "age" : 41, "pets" : { "cats" : 1, "fish" : 3 } }
// { "_id" : 3, "name" : "Maria", "age" : 25 }

db.people.aggregate( [
    { $replaceRoot: { newRoot: { $mergeObjects:  [ { dogs: 0, cats: 0, birds: 0, fish: 0 }, "$pets" ] }} }
 ] )
//  This will merge the objects and then replace the root with it
db.students.drop()
db.students.insertMany([
    {
       "_id" : 1,
       "grades" : [
          { "test": 1, "grade" : 80, "mean" : 75, "std" : 6 },
          { "test": 2, "grade" : 85, "mean" : 90, "std" : 4 },
          { "test": 3, "grade" : 95, "mean" : 85, "std" : 6 }
       ]
    },
    {
       "_id" : 2,
       "grades" : [
          { "test": 1, "grade" : 90, "mean" : 75, "std" : 6 },
          { "test": 2, "grade" : 87, "mean" : 90, "std" : 3 },
          { "test": 3, "grade" : 91, "mean" : 85, "std" : 4 }
       ]
    }
 ])


 db.students.aggregate([
     {$unwind: {
         path: "$grades"
     }},
     {
         $match: {
             "grades.grade": {"$gte": 90}
         }
     },
     {
         $replaceRoot: {newRoot: "$grades"}
     }
 ])


//  Using $replaceRoot with a newly created document
// { "_id" : 1, "first_name" : "Gary", "last_name" : "Sheffield", "city" : "New York" }
// { "_id" : 2, "first_name" : "Nancy", "last_name" : "Walker", "city" : "Anaheim" }
// { "_id" : 3, "first_name" : "Peter", "last_name" : "Sumner", "city" : "Toledo" }

db.contacts.aggregate([
    {
        $replaceRoot: {
            newRoot: {
                full_name: {
                    $concat: ["$first_name", "$last_name"]
                }
            }
        }
    }
])

// $merge
// The $merge operator allows you to output to a collection and it will work like a merge or even to a sharded collection
db.getSiblingDB("zoo").salaries.drop()
db.getSiblingDB("zoo").salaries.insertMany([
    { "_id" : 1, employee: "Ant", dept: "A", salary: 100000, fiscal_year: 2017 },
    { "_id" : 2, employee: "Bee", dept: "A", salary: 120000, fiscal_year: 2017 },
    { "_id" : 3, employee: "Cat", dept: "Z", salary: 115000, fiscal_year: 2017 },
    { "_id" : 4, employee: "Ant", dept: "A", salary: 115000, fiscal_year: 2018 },
    { "_id" : 5, employee: "Bee", dept: "Z", salary: 145000, fiscal_year: 2018 },
    { "_id" : 6, employee: "Cat", dept: "Z", salary: 135000, fiscal_year: 2018 },
    { "_id" : 7, employee: "Gecko", dept: "A", salary: 100000, fiscal_year: 2018 },
    { "_id" : 8, employee: "Ant", dept: "A", salary: 125000, fiscal_year: 2019 },
    { "_id" : 9, employee: "Bee", dept: "Z", salary: 160000, fiscal_year: 2019 },
    { "_id" : 10, employee: "Cat", dept: "Z", salary: 150000, fiscal_year: 2019 }
 ])

 db.getSiblingDB('zoo').salaries.aggregate([
     {$group: {
         _id: {fiscal_year: "$fiscal_year", dept: "$dept"},
         salaries: {$sum: "$salary"}
     }},
     {$merge : {
         into: {db: "reporting", coll: "budgets"}, on: "_id", whenMatched: "replace", whenNotMatched:"insert"
     }}
 ])

 db.getSiblingDB("reporting").budgets.find().sort( { _id: 1 } )

//  { "_id" : 1, employee: "Ant", dept: "A", salary: 100000, fiscal_year: 2017 },
// { "_id" : 2, employee: "Bee", dept: "A", salary: 120000, fiscal_year: 2017 },
// { "_id" : 3, employee: "Cat", dept: "Z", salary: 115000, fiscal_year: 2017 },
// { "_id" : 4, employee: "Ant", dept: "A", salary: 115000, fiscal_year: 2018 },
// { "_id" : 5, employee: "Bee", dept: "Z", salary: 145000, fiscal_year: 2018 },
// { "_id" : 6, employee: "Cat", dept: "Z", salary: 135000, fiscal_year: 2018 },
// { "_id" : 7, employee: "Gecko", dept: "A", salary: 100000, fiscal_year: 2018 },
// { "_id" : 8, employee: "Ant", dept: "A", salary: 125000, fiscal_year: 2019 },
// { "_id" : 9, employee: "Bee", dept: "Z", salary: 160000, fiscal_year: 2019 },
// { "_id" : 10, employee: "Cat", dept: "Z", salary: 150000, fiscal_year: 2019 }

// only inserting new data

db.getSiblingDB("zoo").salaries.aggregate( [
    { $match: { fiscal_year: 2019 }},
    { $group: { _id: { fiscal_year: "$fiscal_year", dept: "$dept" }, employees: { $push: "$employee" } } },
    { $project: { _id: 0, dept: "$_id.dept", fiscal_year: "$_id.fiscal_year", employees: 1 } },
    { $merge : { into : { db: "reporting", coll: "orgArchive" }, on: [ "dept", "fiscal_year" ], whenMatched: "fail" } }
] )

// $bucket
// Categorizes incoming documents into groups, called buckets, based on a specified expression and bucket boundaries and outputs a document per each bucket. Each output document contains an _id field whose value specifies the inclusive lower bound of the bucket. The output option specifies the fields included in each output document.

// $bucket and Memory Restrictions
// The $bucket stage has a limit of 100 megabytes of RAM. By default, if the stage exceeds this limit, $bucket returns an error. To allow more space for stage processing, use the allowDiskUse option to enable aggregation pipeline stages to write data to temporary files.

// Bucket by Year and Filter by Bucket Results
db.artists.insertMany([
    { "_id" : 1, "last_name" : "Bernard", "first_name" : "Emil", "year_born" : 1868, "year_died" : 1941, "nationality" : "France" },
    { "_id" : 2, "last_name" : "Rippl-Ronai", "first_name" : "Joszef", "year_born" : 1861, "year_died" : 1927, "nationality" : "Hungary" },
    { "_id" : 3, "last_name" : "Ostroumova", "first_name" : "Anna", "year_born" : 1871, "year_died" : 1955, "nationality" : "Russia" },
    { "_id" : 4, "last_name" : "Van Gogh", "first_name" : "Vincent", "year_born" : 1853, "year_died" : 1890, "nationality" : "Holland" },
    { "_id" : 5, "last_name" : "Maurer", "first_name" : "Alfred", "year_born" : 1868, "year_died" : 1932, "nationality" : "USA" },
    { "_id" : 6, "last_name" : "Munch", "first_name" : "Edvard", "year_born" : 1863, "year_died" : 1944, "nationality" : "Norway" },
    { "_id" : 7, "last_name" : "Redon", "first_name" : "Odilon", "year_born" : 1840, "year_died" : 1916, "nationality" : "France" },
    { "_id" : 8, "last_name" : "Diriks", "first_name" : "Edvard", "year_born" : 1855, "year_died" : 1930, "nationality" : "Norway" }
  ])

  db.artist.drop()

//   
db.artiests.aggregate([
    {
        $bucket: {
            groupBy: "$year_born",
            boundaries: [1840, 1850, 1860, 1870, 1880],
            default: "Other",
            output: {
                "count": {$sum: 1},
                "artists": {
                    $push : {
                        "name": {$concat: ["$first_name", " ", "$last_name"]},
                        "year_born": "$year_born"
                    }
                }
            }
        }
    }
])

// $indexStats
// The $indexStats is going to return statistics regarding the use of each index for the collection.
{ $indexStats: { } }

db.orders.drop()
db.orders.insertMany([
    { "_id" : 1, "item" : "abc", "price" : 12, "quantity" : 2, "type": "apparel" },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "type": "electronics" },
{ "_id" : 3, "item" : "abc", "price" : 10, "quantity" : 5, "type": "apparel" }

])

db.orders.createIndex({item: 1, quantity: 1})
db.orders.createIndex({type: 1, item: 1})

db.orders.find({
    type: "apparel"
}).sort({item: 1}).explain()

db.orders.aggregate( [ { $indexStats: { } } ] ).pretty()

// $collStats
// Returns statistics regarding a collection or view.

db.matrices.aggregate( [ { $collStats: { latencyStats: { histograms: true } } } ] )

// $sum
// sums the according element
// Calculates and returns the collective sum of numeric values. $sum ignores non-numeric values.
db.sales.drop()
db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T09:05:00Z") }
])

db.sales.aggregate([
    {
        $group: {
            _id: {day: {$dayOfYear: "$date"} , year: {$year: "$date"}},
            totalAmount: {$sum : {$multiply: ["$price", "$quantity"]}},
            count : {$sum :1}
        }
    }
])

// { "_id" : { "day" : 46, "year" : 2014 }, "totalAmount" : 150, "count" : 2 }
// { "_id" : { "day" : 1, "year" : 2014 }, "totalAmount" : 20, "count" : 1 }
// { "_id" : { "day" : 34, "year" : 2014 }, "totalAmount" : 45, "count" : 2 }

// Using sum with the project stage
// $project
db.students.drop()
db.students.insertMany([
    { "_id": 1, "quizzes": [ 10, 6, 7 ], "labs": [ 5, 8 ], "final": 80, "midterm": 75 },
{ "_id": 2, "quizzes": [ 9, 10 ], "labs": [ 8, 8 ], "final": 95, "midterm": 80 },
{ "_id": 3, "quizzes": [ 4, 5, 5 ], "labs": [ 6, 5 ], "final": 78, "midterm": 70 }
])

db.students.aggregate([
    {
      $project: {
        quizTotal: { $sum: "$quizzes"},
        labTotal: { $sum: "$labs" },
        examTotal: { $sum: [ "$final", "$midterm" ] }
      }
    }
 ])

 db.students.aggregate([
     {
         $project: {
             quizTotal: {$sum: "$quizzes"},
             labTotal: {$sum: "$labs"},
             examTotal: {$sum: ["$final", "$midterm"]}
         }
     }
 ])

//  $avg is going to compute the average 

db.sales.drop()
db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T09:12:00Z") }
])

db.sales.aggregate([
    {
        $group: {
            _id: "$item",
            avgAmount: {
                $avg: {
                    $multiply: ["$price", "$quantity"]
                }
            },
            avgQuantity: {
                $avg: "$quantity"
            }
        }
    }
])

// Using the avg in the $project stage
db.students.aggregate([
    {
        $project: {
            totalAvg : {
                $avg: "$quantity"
            }
        }
    }
])

// $addToSet is going to add the item to the set if it does not already exist
db.sales.drop()
db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T09:12:00Z") }
])

db.sales.aggregate([
    {
        $group :{
            _id: {day: {$dayOfYear: "$date"}, year: {$year: "$date"}},
            itemsSold: {$addToSet: "$item"}
        }
    }
])

// $push this will push the item into an array
db.sales.aggregate([
    {$sort: {date:1, item:1}},
    {
        $group: {
            _id: {day: {$dayOfYear: "$date"}, year : {$year: "$date"}},
            itemsSold: {
                $push: {
                    item: "$item", quantity: "$quantity"
                }
            }
        }
    }
]).pretty()

// Aggregation Mechanics
// Need to know the memory limits on the aggregation pipeline 100MB per stage
// Optimizations will be applied in the aggregation pipeline such as $matches being combined and
// $sort + $limit optimization
// When you need to use indexes for aggregation only with $match and $sort

// Optimizing the aggregation pipeline
// Aggregation pipeline operations have an optimization phase which attempts to reshape the pipeline for improved performance.
// To see how the optimizer transforms a particular aggregation pipeline, include the explain option in the db.collection.aggregate() method.
// The aggregation pipeline can determine if it requires only a subset of the fields in the documents to obtain the results. If so, the pipeline will only use those required fields, reducing the amount of data passing through the pipeline.

// Pipeline Sequence Optimization
db.c.aggregate([
    { $addFields: {
        maxTime: { $max: "$times" },
        minTime: { $min: "$times" }
    } },
    { $project: {
        _id: 1, name: 1, times: 1, maxTime: 1, minTime: 1,
        avgTime: { $avg: ["$maxTime", "$minTime"] }
    } },
    { $match: {
        name: "Joe Schmoe",
        maxTime: { $lt: 20 },
        minTime: { $gt: 5 },
        avgTime: { $gt: 7 }
    } }
])

// If the $match is not using any fields in the $project, then it will accordingly move them above the $project as a separate $match
db.a.aggregate([{ $match: { name: "Joe Schmoe" } },
{ $addFields: {
    maxTime: { $max: "$times" },
    minTime: { $min: "$times" }
} },
{ $match: { maxTime: { $lt: 20 }, minTime: { $gt: 5 } } },
{ $project: {
    _id: 1, name: 1, times: 1, maxTime: 1, minTime: 1,
    avgTime: { $avg: ["$maxTime", "$minTime"] }
} },
{ $match: { avgTime: { $gt: 7 } } }])

// $sort + $match sequence optimization
// $match will alway move before the $sort to reduce the amount of data

// $redact + $match sequence optimization
// { $redact: { $cond: { if: { $eq: [ "$level", 5 ] }, then: "$$PRUNE", else: "$$DESCEND" } } },
// { $match: { year: 2014, category: { $ne: "Z" } } }
// { $match: { year: 2014 } },
// { $redact: { $cond: { if: { $eq: [ "$level", 5 ] }, then: "$$PRUNE", else: "$$DESCEND" } } },
// { $match: { year: 2014, category: { $ne: "Z" } } }

// $project /$unset + $skip optimization
// { $sort: { age : -1 } },
// { $project: { status: 1, name: 1 } },
// { $skip: 5 }

// Pipeline Coalescence Optimization

// { $sort : { age : -1 } },
// { $project : { age : 1, status : 1, name : 1 } },
// { $limit: 5 }

// {
//     "$sort" : {
//        "sortKey" : {
//           "age" : -1
//        },
//        "limit" : NumberLong(5)
//     }
// },
// { "$project" : {
//          "age" : 1,
//          "status" : 1,
//          "name" : 1
//   }
// }

// {
//     $lookup: {
//       from: "otherCollection",
//       as: "resultingArray",
//       localField: "x",
//       foreignField: "y",
//       unwinding: { preserveNullAndEmptyArrays: false }
//     }
//   }

// Improve Performance With Indexes and Document Filters
// $match stage
// $match can use an index to filter documents if $match is the first stage in a pipeline.
// $sort stage
// $sort can use an index if $sort is not preceded by a $project, $unwind, or $group stage.

// $group with a sort before and only using $first and there is an index on the $_id for group

// $geoNear can use a geospatial index. $geoNear must be the first stage in an aggregation pipeline.

// Document Filters
// If your aggregation operation requires only a subset of the documents in a collection, filter the documents first:
// Use the $match, $limit, and $skip stages to restrict the documents that enter the pipeline.
// When possible, put $match at the beginning of the pipeline to use indexes that scan the matching documents in a collection.
// $match followed by $sort at the start of the pipeline is equivalent to a single query with a sort, and can use an index.

// db.data.find( { a: 5 } ).sort( { b: 1, c: 1 } )
// { a: 1 , b: 1, c: 1 }
// db.data.find( { b: 3, a: 4 } ).sort( { c: 1 } )
// { a: 1, b: 1, c: 1 }
// db.data.find( { a: 5, b: { $lt: 3} } ).sort( { b: 1 } )
// { a: 1, b: 1 }

// Aggregation Pipeline Limits
// T
// Remember that there is a document limit of 16MB
// If you need to use disk memory then you can use the allowDiskUsage and set it to true
// The stages that can spill to disk are: $bucket, $bucketAuto, $group, $sort, $sortByCount

// Aggregation Pipeline Behavior
db.orders.insertMany( [
    { _id: 0, name: "Pepperoni", size: "small", price: 19,
      quantity: 10, date: ISODate( "2021-03-13T08:14:30Z" ) },
    { _id: 1, name: "Pepperoni", size: "medium", price: 20,
      quantity: 20, date : ISODate( "2021-03-13T09:13:24Z" ) },
    { _id: 2, name: "Pepperoni", size: "large", price: 21,
      quantity: 30, date : ISODate( "2021-03-17T09:22:12Z" ) },
    { _id: 3, name: "Cheese", size: "small", price: 12,
      quantity: 15, date : ISODate( "2021-03-13T11:21:39.736Z" ) },
    { _id: 4, name: "Cheese", size: "medium", price: 13,
      quantity:50, date : ISODate( "2022-01-12T21:23:13.331Z" ) },
    { _id: 5, name: "Cheese", size: "large", price: 14,
      quantity: 10, date : ISODate( "2022-01-12T05:08:13Z" ) },
    { _id: 6, name: "Vegan", size: "small", price: 17,
      quantity: 10, date : ISODate( "2021-01-13T05:08:13Z" ) },
    { _id: 7, name: "Vegan", size: "medium", price: 18,
      quantity: 10, date : ISODate( "2021-01-13T05:10:13Z" ) }
 ] )

//  Calculate the total Order Quantity
db.orders.aggregate([
    {
        $match: {
            size: "medium"
        }
    },
    {
        $group: {
            _id: "$name", totalQuantity: {$sum: "$quantity"}
        }
    }
])


// Calculating total order value and average order quantity
db.orders.aggregate([
    {
        $match: {
            "date": {
                $gte: new ISODate("2020-01-30"), $lt: new ISODate("2022-01-30")
            }
        }
    },
    {
        $group: {
            _id: {$dateToString: {format: "%Y-%m-%d", date:"$date"}},
            totalOrderValue: {$sum: {$multiply: ["$price", "$quantity"]}},
            averageOrderQuantity: {$avg: "$quantity"}
        }
    },
    {
        $sort: {
            totalOrderValue: -1
        }
    }
])

// Aggregation with User Preference Data
db.users.insertMany([
    {
        _id : "jane",
        joined : ISODate("2011-03-02"),
        likes : ["golf", "racquetball"]
      },
      {
        _id : "joe",
        joined : ISODate("2012-07-02"),
        likes : ["tennis", "golf", "swimming"]
      }
])


db.users.drop()

db.users.aggregate([
    {
        $project: {name: {$toUpper: "$_id"}, _id:0}
       
    },
    {$sort: {name:1}}
])

// Return usernames ordered by join month
db.users.aggregate([
    {
        $project: {
            month_joined: {$month: "$joined"},
            name: "$_id",
            _id: 0
        }
    },
    {$sort: {month_joined: 1}}
])

db.users.aggregate([
    {
        $project: {
            month_joined: {$month: "$joined"}
        } 
    },
    {
        $group: {
            _id: {month_joined: "$month_joined"},
            number: {$sum: 1}
        }
    },
    {
        $sort: {
            "_id.month_joined": 1
        }
    }
])


db.users.aggregate([
    {
        $unwind: "$likes"
    },
    {
        $group: {
            _id: "$likes",
            number: {$sum:1}
        }
    },
    {
        $limit:5
    }
])

// Aggregation with the zip code dataset
db.zipcodes.insertMany([{
    "_id": "10280",
    "city": "NEW YORK",
    "state": "NY",
    "pop": 5574,
    "loc": [
      -74.016323,
      40.710537
    ]
  }])


db.zipcodes.aggregate([

])

// Returning states with populations above 10 million we care about the states only
db.zipcodes.aggregate([{
    $group :{
        _id: {state: "$state"},
        totalPopulation: {$sum: "$pop"}
    }},
    {
        $match :{
            totalPopulation : {
                $gte: 5000
            }
        }
    }

])

// Returning the average City Population By State
// We want to group by the state and then we want to return the avg population 
db.zipcodes.aggregate([
    {
        $group :{
            _id: {state: "$state"},
            avgPopulation: {$avg: "$pop"}
        }
        
    }
])

// Returning the largest and smallest cities by state
db.zipcodes.aggregate( [
    { $group:
       {
         _id: { state: "$state", city: "$city" },
         pop: { $sum: "$pop" }
       }
    },
    { $sort: { pop: 1 } },
    { $group:
       {
         _id : "$_id.state",
         biggestCity:  { $last: "$_id.city" },
         biggestPop:   { $last: "$pop" },
         smallestCity: { $first: "$_id.city" },
         smallestPop:  { $first: "$pop" }
       }
    },
 
   // the following $project is optional, and
   // modifies the output format.
 
   { $project:
     { _id: 0,
       state: "$_id",
       biggestCity:  { name: "$biggestCity",  pop: "$biggestPop" },
       smallestCity: { name: "$smallestCity", pop: "$smallestPop" }
     }
   }
 ] )

//  Optional. Additional options that aggregate() passes to the aggregate command. Available only if you specify the pipeline as an array.
// The options fields that can be passed into aggregate()

