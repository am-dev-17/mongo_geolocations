// Aggregation Pipeline Operators
// $sum operator example
db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T09:05:00Z") }
])

// Now lets do a aggregate with grouping by the day and the year of date
db.sales.aggregate([
    {
        $group: {
            _id: {day: {$dayOfYear: "$date"}, year: {$year: "$date"}},
            totalAmount: {
                $sum: {
                    $multiply : ["$price", "$quantity"]
                }
            }
        }
    }
])

db.students.insertMany([
    { "_id": 1, "quizzes": [ 10, 6, 7 ], "labs": [ 5, 8 ], "final": 80, "midterm": 75 },
{ "_id": 2, "quizzes": [ 9, 10 ], "labs": [ 8, 8 ], "final": 95, "midterm": 80 },
{ "_id": 3, "quizzes": [ 4, 5, 5 ], "labs": [ 6, 5 ], "final": 78, "midterm": 70 },
])

// Using the $sum in the $project stage
db.students.aggregate([
    {
        $project : {
            quizTotal: {$sum: "$quizzes"},
            labTotal: {$sum: "$labs"},

        }
    }
])

// $avg operator
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
            _id: {"item": "$item"},
            avgAmount : { $avg: { $multiply :["$price", "$quantity"] }},
            avgQuantity: {$avg: "$quantity"}
        }
    }
])

db.sales.aggregate([
    {
        $group: {
            _id: {"item": "$item"},
            avgAmount : { $avg: { $multiply :["$price", "$quantity"] }},
            avgQuantity: {$avg: "$quantity"}
        }
    }
])

// Using $avg in the $project stage
db.sales.aggregate([
    {$project: {
        quizAvg: {$avg: "$quizzes"}
    }
}
])


// Using $avg with setWindowFields
db.cakeSales.insertMany( [
    { _id: 0, type: "chocolate", orderDate: new Date("2020-05-18T14:10:30Z"),
      state: "CA", price: 13, quantity: 120 },
    { _id: 1, type: "chocolate", orderDate: new Date("2021-03-20T11:30:05Z"),
      state: "WA", price: 14, quantity: 140 },
    { _id: 2, type: "vanilla", orderDate: new Date("2021-01-11T06:31:15Z"),
      state: "CA", price: 12, quantity: 145 },
    { _id: 3, type: "vanilla", orderDate: new Date("2020-02-08T13:13:23Z"),
      state: "WA", price: 13, quantity: 104 },
    { _id: 4, type: "strawberry", orderDate: new Date("2019-05-18T16:09:01Z"),
      state: "CA", price: 41, quantity: 162 },
    { _id: 5, type: "strawberry", orderDate: new Date("2019-01-08T06:12:03Z"),
      state: "WA", price: 43, quantity: 134 }
 ] )

 db.cakeSales.aggregate( [
    {
       $setWindowFields: {
          partitionBy: "$state",
          sortBy: { orderDate: 1 },
          output: {
             averageQuantityForState: {
                $avg: "$quantity",
                window: {
                   documents: [ "unbounded", "current" ]
                }
             }
          }
       }
    }
 ] )

//  $addToSet
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
            _id: {day : {$dayOfYear: "$date"}, year: {$year: "$date"}},
            itemsSold: {
                $addToSet: "$item"
            }
        }
    }
])

// { "_id" : { "day" : 1, "year" : 2014 }, "itemsSold" : [ "abc" ] }
// { "_id" : { "day" : 46, "year" : 2014 }, "itemsSold" : [ "abc", "xyz" ] }
// { "_id" : { "day" : 34, "year" : 2014 }, "itemsSold" : [ "jkl", "xyz" ] }
// >

// 

db.cakeSales.aggregate( [
    {
       $setWindowFields: {
          partitionBy: "$state",
          sortBy: { orderDate: 1 },
          output: {
             cakeTypesForState: {
                $addToSet: "$type",
                window: {
                   documents: [ "unbounded", "current" ]
                }
             }
          }
       }
    }
 ] )

//  { "_id" : 4, "type" : "strawberry", "orderDate" : ISODate("2019-05-18T16:09:01Z"),
//   "state" : "CA", "price" : 41, "quantity" : 162,
//   "cakeTypesForState" : [ "strawberry" ] }
// { "_id" : 0, "type" : "chocolate", "orderDate" : ISODate("2020-05-18T14:10:30Z"),
//   "state" : "CA", "price" : 13, "quantity" : 120,
//   "cakeTypesForState" : [ "strawberry", "chocolate" ] }
// { "_id" : 2, "type" : "vanilla", "orderDate" : ISODate("2021-01-11T06:31:15Z"),
//   "state" : "CA", "price" : 12, "quantity" : 145,
//   "cakeTypesForState" : [ "strawberry", "vanilla", "chocolate" ] }
// { "_id" : 5, "type" : "strawberry", "orderDate" : ISODate("2019-01-08T06:12:03Z"),
//   "state" : "WA", "price" : 43, "quantity" : 134,
//   "cakeTypesForState" : [ "strawberry" ] }
// { "_id" : 3, "type" : "vanilla", "orderDate" : ISODate("2020-02-08T13:13:23Z"),
//   "state" : "WA", "price" : 13, "quantity" : 104,
//   "cakeTypesForState" : [ "vanilla", "strawberry" ] }
// { "_id" : 1, "type" : "chocolate", "orderDate" : ISODate("2021-03-20T11:30:05Z"),
//   "state" : "WA", "price" : 14, "quantity" : 140,
//   "cakeTypesForState" : [ "vanilla", "chocolate", "strawberry" ] }

db.sales.insertMany([
    { "_id" : 1, "item" : "abc", "price" : 10, "quantity" : 2, "date" : ISODate("2014-01-01T08:00:00Z") },
{ "_id" : 2, "item" : "jkl", "price" : 20, "quantity" : 1, "date" : ISODate("2014-02-03T09:00:00Z") },
{ "_id" : 3, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-03T09:05:00Z") },
{ "_id" : 4, "item" : "abc", "price" : 10, "quantity" : 10, "date" : ISODate("2014-02-15T08:00:00Z") },
{ "_id" : 5, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T09:05:00Z") },
{ "_id" : 6, "item" : "xyz", "price" : 5, "quantity" : 5, "date" : ISODate("2014-02-15T12:05:10Z") },
{ "_id" : 7, "item" : "xyz", "price" : 5, "quantity" : 10, "date" : ISODate("2014-02-15T14:12:12Z") }
])

    db.sales.aggregate([
        {$sort: {date: 1, item: 1}},
            {$group: {
                _id: {day : {$dayOfYear: "$date"}, year: {$year: "$date"}},
                itemsSold: {
                    $push : "$item"
                }
            }}
    ])

    
    db.sales.aggregate(
        [
        { $sort: { date: 1, item: 1 } },
        {
            $group:
              {
                _id: { day: { $dayOfYear: "$date"}, year: { $year: "$date" } },
                itemsSold: { $push:  { item: "$item", quantity: "$quantity" } }
              }
          }
        ]
     )

// $setWindowFields
db.cakeSales.insertMany( [
    { _id: 0, type: "chocolate", orderDate: new Date("2020-05-18T14:10:30Z"),
      state: "CA", price: 13, quantity: 120 },
    { _id: 1, type: "chocolate", orderDate: new Date("2021-03-20T11:30:05Z"),
      state: "WA", price: 14, quantity: 140 },
    { _id: 2, type: "vanilla", orderDate: new Date("2021-01-11T06:31:15Z"),
      state: "CA", price: 12, quantity: 145 },
    { _id: 3, type: "vanilla", orderDate: new Date("2020-02-08T13:13:23Z"),
      state: "WA", price: 13, quantity: 104 },
    { _id: 4, type: "strawberry", orderDate: new Date("2019-05-18T16:09:01Z"),
      state: "CA", price: 41, quantity: 162 },
    { _id: 5, type: "strawberry", orderDate: new Date("2019-01-08T06:12:03Z"),
      state: "WA", price: 43, quantity: 134 }
 ] )

 db.cakeSales.aggregate( [
    {
       $setWindowFields: {
          partitionBy: "$state",
          sortBy: { orderDate: 1 },
          output: {
             quantitiesForState: {
                $push: "$quantity",
                window: {
                   documents: [ "unbounded", "current" ]
                }
             }
          }
       }
    }
 ] )

 db.sales.aggregate([
     {
         $group: {
             _id: "$item",
             maxTotalAmount: {
                 $max: {
                     $multiply: ["$price", "$quantity"]
                 }
             },
             maxQuantity :{
                 $max : "$quantity"
             }
         }
     }
 ])

//  Using $max in the $project operator
    db.sales.aggregate([
        {
            $project: {
                maxQuantity: {
                    $max : "$quantity"
                }
            }
        }
    ])

    // { "_id" : 1, "maxQuantity" : 2 }
    // { "_id" : 2, "maxQuantity" : 1 }
    // { "_id" : 3, "maxQuantity" : 5 }
    // { "_id" : 4, "maxQuantity" : 10 }
    // { "_id" : 5, "maxQuantity" : 10 }
    // { "_id" : 6, "maxQuantity" : 5 }
    // { "_id" : 7, "maxQuantity" : 10 }

    db.sales.aggregate([
        {
            $project: {
                maxQuantity: {
                    $max : "$quantity"
                }
            }
        }
    ])

    db.cakeSales.aggregate( [
        {
           $setWindowFields: {
              partitionBy: "$state",
              sortBy: { orderDate: 1 },
              output: {
                 maximumQuantityForState: {
                    $max: "$quantity",
                    window: {
                       documents: [ "unbounded", "current" ]
                    }
                 }
              }
           }
        }
     ] )

//      { "_id" : 4, "type" : "strawberry", "orderDate" : ISODate("2019-05-18T16:09:01Z"),
//   "state" : "CA", "price" : 41, "quantity" : 162, "maximumQuantityForState" : 162 }
// { "_id" : 0, "type" : "chocolate", "orderDate" : ISODate("2020-05-18T14:10:30Z"),
//   "state" : "CA", "price" : 13, "quantity" : 120, "maximumQuantityForState" : 162 }
// { "_id" : 2, "type" : "vanilla", "orderDate" : ISODate("2021-01-11T06:31:15Z"),
//   "state" : "CA", "price" : 12, "quantity" : 145, "maximumQuantityForState" : 162 }
// { "_id" : 5, "type" : "strawberry", "orderDate" : ISODate("2019-01-08T06:12:03Z"),
//   "state" : "WA", "price" : 43, "quantity" : 134, "maximumQuantityForState" : 134 }
// { "_id" : 3, "type" : "vanilla", "orderDate" : ISODate("2020-02-08T13:13:23Z"),
//   "state" : "WA", "price" : 13, "quantity" : 104, "maximumQuantityForState" : 134 }
// { "_id" : 1, "type" : "chocolate", "orderDate" : ISODate("2021-03-20T11:30:05Z"),
//   "state" : "WA", "price" : 14, "quantity" : 140, "maximumQuantityForState" : 140 }

// $accumulator
//Defines a custom accumulator operator. Accumulators are operators that maintain their state (e.g. totals, maximums, minimums, and related data) as documents progress through the pipeline. Use the $accumulator operator to execute your own JavaScript functions to implement behavior not supported by the MongoDB Query Language. See also $function.

// Using $accumulator to implement the $avg operator
db.books.insertMany([
    { "_id" : 8751, "title" : "The Banquet", "author" : "Dante", "copies" : 2 },
    { "_id" : 8752, "title" : "Divine Comedy", "author" : "Dante", "copies" : 1 },
    { "_id" : 8645, "title" : "Eclogues", "author" : "Dante", "copies" : 2 },
    { "_id" : 7000, "title" : "The Odyssey", "author" : "Homer", "copies" : 10 },
    { "_id" : 7020, "title" : "Iliad", "author" : "Homer", "copies" : 10 }
  ])

  db.books.aggregate([
    {
      $group :
      {
        _id : "$author",
        avgCopies:
        {
          $accumulator:
          {
            init: function() {                        // Set the initial state
              return { count: 0, sum: 0 }
            },
    
            accumulate: function(state, numCopies) {  // Define how to update the state
              return {
                count: state.count + 1,
                sum: state.sum + numCopies
              }
            },
    
            accumulateArgs: ["$copies"],              // Argument required by the accumulate function
    
            merge: function(state1, state2) {         // When the operator performs a merge,
              return {                                // add the fields from the two states
                count: state1.count + state2.count,
                sum: state1.sum + state2.sum
              }
            },
    
            finalize: function(state) {               // After collecting the results from all documents,
              return (state.sum / state.count)        // calculate the average
            },
            lang: "js"
          }
        }
      }
    }
    ])
    // { "_id" : "Dante", "avgCopies" : 1.6666666666666667 }
    // { "_id" : "Homer", "avgCopies" : 10 }
db.runninglog.insertMany([
    { "_id" : 1, "team" : "Anteater", log: [ { run: 1, distance: 8 }, { run2: 2, distance: 7.5 }, { run: 3, distance: 9.2 } ] },
    { "_id" : 2, "team" : "Bears", log: [ { run: 1, distance: 18 }, { run2: 2, distance: 17 }, { run: 3, distance: 16 } ] },
    { "_id" : 3, "team" : "Cobras", log: [ { run: 1, distance: 2 } ] }
    ])

db.runninglog.aggregate([
{ $addFields: { firstrun: { $first: "$log" }, lastrun: { $last: "$log" } } }
])
// $first and $last are used for retrieving the first and last items from the array

