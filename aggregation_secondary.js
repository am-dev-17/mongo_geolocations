// $unwind operator
// You can pass the array field path to the $unwind operator
db.inventory.insertOne({ "_id" : 1, "item" : "ABC1", sizes: [ "S", "M", "L"] })

db.inventory.aggregate([
    {
        $unwind: "$sizes"
    }
])

// The $unwind operator is going to make an element
// for each value in the array

db.inventory2.insertMany([
    { "_id" : 1, "item" : "ABC", price: NumberDecimal("80"), "sizes": [ "S", "M", "L"] },
    { "_id" : 2, "item" : "EFG", price: NumberDecimal("120"), "sizes" : [ ] },
    { "_id" : 3, "item" : "IJK", price: NumberDecimal("160"), "sizes": "M" },
    { "_id" : 4, "item" : "LMN" , price: NumberDecimal("10") },
    { "_id" : 5, "item" : "XYZ", price: NumberDecimal("5.75"), "sizes" : null }
  ])

//   Preserve null and empty arrays
// includeArrayIndex

db.inventory2.aggregate([
    {$unwind: "$sizes"}
    //Non null and non empty values will get treated as
    // just the element itself
])


// IncludeArrayIndex
db.inventory2.aggregate([
    {
        $unwind: 
        {
            path:"$sizes",
            includeArrayIndex: "arrayIndex"
        }
    }
])


// Preserve Null and Empty Arrays
db.inventory2.aggregate([
    {$unwind: {
        path: "$sizes",
        preserveNullAndEmptyArrays: true
    }}
])

// Group by unwound values
db.inventory2.aggregate([
    {
        $unwind : {
            path: "$sizes",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $group: {
            _id: "$sizes",
            averagePrice: {
                $avg: "$price"
            }
        }
    },
    {
        $sort: {
            "averagePrice": -1
        }
    }

])

// Unwind embedded arrays
db.sales.insertMany([
    {
      _id: "1",
      "items" : [
       {
        "name" : "pens",
        "tags" : [ "writing", "office", "school", "stationary" ],
        "price" : NumberDecimal("12.00"),
        "quantity" : NumberInt("5")
       },
       {
        "name" : "envelopes",
        "tags" : [ "stationary", "office" ],
        "price" : NumberDecimal("1.95"),
        "quantity" : NumberInt("8")
       }
      ]
    },
    {
      _id: "2",
      "items" : [
       {
        "name" : "laptop",
        "tags" : [ "office", "electronics" ],
        "price" : NumberDecimal("800.00"),
        "quantity" : NumberInt("1")
       },
       {
        "name" : "notepad",
        "tags" : [ "stationary", "school" ],
        "price" : NumberDecimal("14.95"),
        "quantity" : NumberInt("3")
       }
      ]
    }
  ])

  db.sales.aggregate([
      {$unwind: "$items"},
      {$unwind: "$items.tags"},
      {
          $group: {
              _id: "$items.tags",
              totalSalesAmount :{
                  $sum: {
                      $multiply: ["$items.price","$items.quantity"]
                  }
              }
          }
      }
  ])



// $out operator
// Takes the documents returned by aggregation framework and 
// outputs them to a specified collection and db
// $out must be the last stage in operations
// $out cannot push to a sharded collection

// $out vs $merge
db.getSiblingDB("test").books.insertMany([
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
 ])

 db.getSiblingDB("test").books.aggregate( [
    { $group : { _id : "$author", books: { $push: "$title" } } },
    { $out : "authors" } //will write results to authors
] )

db.getSiblingDB("test").books.aggregate( [
    { $group : { _id : "$author", books: { $push: "$title" } } },
    { $out : { db: "reporting", coll: "authors" } }
] )

// $merge
// The merge operator can output to a different database/collection
// Works on outputting to sharded collections
// { $merge: {
//     into: <collection> -or- { db: <db>, coll: <collection> },
//     on: <identifier field> -or- [ <identifier field1>, ...],  // Optional
//     let: <variables>,                                         // Optional
//     whenMatched: <replace|keepExisting|merge|fail|pipeline>,  // Optional
//     whenNotMatched: <insert|discard|fail>                     // Optional
// } }

// Example of Merge
db.collection.aggregate([{ $merge: { into: "myOutput", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }])

// The into syntax is 
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
     {
         $group :{
             _id: {fiscal_year: "$fiscal_year", dept: "$dept"}, 
             salaries: {$sum: "$salary"}
         },
     },
     {
         $merge :{
             into: {
                 db: "reporting", coll: "budgets"
             },
             on: "_id", 
             whenMatched: "replace",
             whenNotMatched: "insert" //This is upsert functionality
         }
     }
 ])

//  View the documents in the other DB
db.getSiblingDB("reporting").budgets.find().sort({_id: 1})

// On demand materialized view update and replace data
db.salaries.insertMany([

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

db.budgets.insertMany([
    { "_id" : { "fiscal_year" : 2017, "dept" : "A" }, "salaries" : 220000 },
    { "_id" : { "fiscal_year" : 2017, "dept" : "Z" }, "salaries" : 115000 },
    { "_id" : { "fiscal_year" : 2018, "dept" : "A" }, "salaries" : 215000 },
    { "_id" : { "fiscal_year" : 2018, "dept" : "Z" }, "salaries" : 280000 },
    { "_id" : { "fiscal_year" : 2019, "dept" : "A" }, "salaries" : 125000 },
    { "_id" : { "fiscal_year" : 2019, "dept" : "Z" }, "salaries" : 310000 }
])

db.salaries.insertMany([
    { "_id" : 11,  employee: "Wren", dept: "Z", salary: 100000, fiscal_year: 2019 },
    { "_id" : 12,  employee: "Zebra", dept: "A", salary: 150000, fiscal_year: 2019 },
    { "_id" : 13,  employee: "headcount1", dept: "Z", salary: 120000, fiscal_year: 2020 },
    { "_id" : 14,  employee: "headcount2", dept: "Z", salary: 120000, fiscal_year: 2020 }
 ])

//  Only insert new data
db.salaries.insertMany([
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

// Merging results from multiple collections
db.purchaseorders.insertMany( [
    { _id: 1, quarter: "2019Q1", region: "A", qty: 200, reportDate: new Date("2019-04-01") },
    { _id: 2, quarter: "2019Q1", region: "B", qty: 300, reportDate: new Date("2019-04-01") },
    { _id: 3, quarter: "2019Q1", region: "C", qty: 700, reportDate: new Date("2019-04-01") },
    { _id: 4, quarter: "2019Q2", region: "B", qty: 300, reportDate: new Date("2019-07-01") },
    { _id: 5, quarter: "2019Q2", region: "C", qty: 1000, reportDate: new Date("2019-07-01") },
    { _id: 6, quarter: "2019Q2", region: "A", qty: 400, reportDate: new Date("2019-07-01") },
 ] )

 db.reportedsales.insertMany( [
    { _id: 1, quarter: "2019Q1", region: "A", qty: 400, reportDate: new Date("2019-04-02") },
    { _id: 2, quarter: "2019Q1", region: "B", qty: 550, reportDate: new Date("2019-04-02") },
    { _id: 3, quarter: "2019Q1", region: "C", qty: 1000, reportDate: new Date("2019-04-05") },
    { _id: 4, quarter: "2019Q2", region: "B", qty: 500, reportDate: new Date("2019-07-02") },
 ] )

//  { "_id" : "2019Q1", "sales" : 1950, "purchased" : 1200 }
// { "_id" : "2019Q2", "sales" : 500, "purchased" : 1700 }

db.purchaseorders.aggregate([
    {
        $group : {
            _id: {quarter: "$quarter"},
            purchased : {
                $sum: "$qty"
            }
        }
    },
    {
        $merge: {
            into: "quarterlyreport",
            on: "_id",
            whenMatched: "merge",
            whenNotMatched: "insert"
        }
    }
])

// $sample operator
// $sample will randomly select the specified number of documents
db.users.insertMany([
    { "_id" : 1, "name" : "dave123", "q1" : true, "q2" : true },
{ "_id" : 2, "name" : "dave2", "q1" : false, "q2" : false  },
{ "_id" : 3, "name" : "ahn", "q1" : true, "q2" : true  },
{ "_id" : 4, "name" : "li", "q1" : true, "q2" : false  },
{ "_id" : 5, "name" : "annT", "q1" : false, "q2" : true  },
{ "_id" : 6, "name" : "li", "q1" : true, "q2" : true  },
{ "_id" : 7, "name" : "ty", "q1" : false, "q2" : true  }
])

db.users.aggregate(
    [
        {$sample: {size: 3}}
    ]
)

// $geoNear
// Will output the documents in order of nearest to farthest from a specified point
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

 db.places.createIndex(
     {location: "2dsphere"}
 )

//  At most 2 meters away from the origin
db.places.aggregate([
    {
        $geoNear: {
            near: {type: "Point", coordinates: [ -73.99279 , 40.719296 ]},
            distanceField: "dist.calculated",
            maxDistance: 2,
            query:{
                category: "Parks"
            },
            includeLocs:"dist.location",
            spherical: true
        }
    }
])

db.places.aggregate([
    {
        $geoNear: {
            near: {type: "Point", coordinates: [ -73.99279 , 40.719296 ] },
            distanceField: "dist.calculated",
            minDistance: 2,
            query: {category: "Parks"},
            includeLocs: "dist.location",
            spherical: true
        }
    }
])

// Specify which Geospatial Index to use
db.places.aggregate([
    {
      $geoNear: {
         near: { type: "Point", coordinates: [ -73.98142 , 40.71782 ] },
         key: "location", //Use the key so that the $geoNear knows which points to use
         distanceField: "dist.calculated",
         query: { "category": "Parks" }
      }
    },
    { $limit: 5 }
 ])

//  $lookup
// $lookup is a left outer join

db.orders.insertMany( [
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
    { "_id" : 3  }
 ] )

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
         $lookup: {
             from: "inventory",
             localField:"item",
             foreignField: "sku",
             as: "inventory_docs"
         }
     }
 ])


//  { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2, "inventory_docs" : [ { "_id" : 1, "sku" : "almonds", "description" : "product 1", "instock" : 120 } ] }
// { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1, "inventory_docs" : [ { "_id" : 4, "sku" : "pecans", "description" : "product 4", "instock" : 70 } ] }
// { "_id" : 3, "inventory_docs" : [ { "_id" : 5, "sku" : null, "description" : "Incomplete" }, { "_id" : 6 } ] }


// Using $lookup with an Array
db.members.insertMany( [
    { _id: 1, name: "artie", joined: new Date("2016-05-01"), status: "A" },
    { _id: 2, name: "giraffe", joined: new Date("2017-05-01"), status: "D" },
    { _id: 3, name: "giraffe1", joined: new Date("2017-10-01"), status: "A" },
    { _id: 4, name: "panda", joined: new Date("2018-10-11"), status: "A" },
    { _id: 5, name: "pandabear", joined: new Date("2018-12-01"), status: "A" },
    { _id: 6, name: "giraffe2", joined: new Date("2018-12-01"), status: "D" }
 ] )

 //The classes
 db.classes.insertMany( [
    { _id: 1, title: "Reading is ...", enrollmentlist: [ "giraffe2", "pandabear", "artie" ], days: ["M", "W", "F"] },
    { _id: 2, title: "But Writing ...", enrollmentlist: [ "giraffe1", "artie" ], days: ["T", "F"] }
 ] )

 db.classes.aggregate([
     {
         $lookup: {
             from:"members",
             localField: "enrollmentlist",
             foreignField: "name",
             as: "enrollee_info"
         }
     }
 ])

//  Using $lookup with $mergeObjects
db.orders.insertMany( [
    { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
    { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 }
 ] )

 db.items.insertMany( [
    { "_id" : 1, "item" : "almonds", description: "almond clusters", "instock" : 120 },
    { "_id" : 2, "item" : "bread", description: "raisin and nut bread", "instock" : 80 },
    { "_id" : 3, "item" : "pecans", description: "candied pecans", "instock" : 60 }
  ] )

  //already ran the query
  