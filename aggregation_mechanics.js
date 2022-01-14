// Memory limits imposed on an aggregation pipeline
// Optimizations that are applied to the aggregation pipeline
// When you need to use indexes for aggregation

// Aggregation pipeline operations have an optimization phase which attempts to reshape the pipeline for improved performance.
// include the explain option in db.collection.aggregate()

// Projection Optimization
db.collection.aggregate([
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
db.collections.aggregate([
{ $match: { name: "Joe Schmoe" } },
{ $addFields: {
    maxTime: { $max: "$times" },
    minTime: { $min: "$times" }
} },
{ $match: { maxTime: { $lt: 20 }, minTime: { $gt: 5 } } },
{ $project: {
    _id: 1, name: 1, times: 1, maxTime: 1, minTime: 1,
    avgTime: { $avg: ["$maxTime", "$minTime"] }
} },
{ $match: { avgTime: { $gt: 7 } } }
])

// The $match will be divided to the point that it is above any $project or $addFields it does not need!


// $sort + $match sequence optimization
db.c.aggregate([
    { $sort: { age : -1 } },
{ $match: { status: 'A' } }
])

// $redact and $match
// $redact :restricts the contents of the documents depending on accesses
db.c.aggregate([
    { $redact: { $cond: { if: { $eq: [ "$level", 5 ] }, then: "$$PRUNE", else: "$$DESCEND" } } },
{ $match: { year: 2014, category: { $ne: "Z" } } }
])

// Optimized form
db.c.aggregate([
    { $match: { year: 2014 } },
{ $redact: { $cond: { if: { $eq: [ "$level", 5 ] }, then: "$$PRUNE", else: "$$DESCEND" } } },
{ $match: { year: 2014, category: { $ne: "Z" } } }
])


// $project/$unset + $skip
// $skip will move before the $project

// $sort + $limit coalesesence
db.c.aggregate([
    {$sort: {age: -1}},
    {$project: {age:1, status: 1, name: 1}},
    {$limit: 5}
])
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

// Allows for sort to only have to maintain the top n values!

// $lookup and $unwind coalesce!
db.c.aggregate([
    {
        $lookup: {
            from: "otherCollection",
            as: "resultingArray",
            localField: "x",
            foreignField: "y"
        }
    },
    {
        $unwind: "$resultingArray"
    }
])

// $sort + $skip + $limit
db.c.aggregate([
    { $sort: { age : -1 } },
{ $skip: 10 },
{ $limit: 5 }
])

db.c.aggregate([
    {
        "$sort" : {
           "sortKey" : {
              "age" : -1
           },
           "limit" : NumberLong(15)
        }
     },
     {
        "$skip" : NumberLong(10)
     }
])

// Aggregation Pipeline Limits
// There are limits with the aggregation pipeline
// 16MB document limit for each document in the result set
// maximum 1000 stages per aggregation pipeline
// Memory Restriction : 100 MB of RAM per individual pipeline stage
// some pipeline stages can use the allowDiskUse option to enable aggregation pipelines to use disk space.

// Aggregation Pipeline Behavior
// Pipeline Operators and Indexes
// The following pipelines can take advantage of indexes:
// $match - Uses an index if it occurs at the beginning of a pipeline
// $sort - uses can index as long as it is not preceded by $project $unwind or $group
// $group - can sometimes use an index to find the first document in each group 
// The $geoNear pipeline operator takes advantage of a geospatial index. When using $geoNear, the $geoNear pipeline operation must appear as the first stage in an aggregation pipeline.

// Early Filtering

// Considerations
// Aggregations can be done on sharded collections

// Aggregation Performance
// Index usage for aggregation queries
// $Match can be done at the beginning
// $Sort if no $project, $addToSet, or $unwind is used

// Aggregation options
// The aggregation options available
// The effect of these aggregation options
// explain -> Get the query 
// allowDiskUse -> Can the aggregation framework use the harddrive for aggregation (100MB in memory limitation)
// cursor - 

db.zips.aggregate(
    [
    {$group: {_id: "$state", population: {$sum : "$pop"}}}
], 
{explain:true}
)

db.zips.aggregate(
    [
    {$group: {_id: "$state", population: {$sum : "$pop"}}}
], 
{sllowDiskUse:true}
)

db.zips.aggregate(
    [
    {$group: {_id: "$state", population: {$sum : "$pop"}}}
], 
{sllowDiskUse:true}
)

// Single Purpose Aggregation Operations
db.orders.distinct("cust_id")
db.orders.estimatedDocumentCount() //Uses the metadata to return the count
db.collection.count() //Takes a query and then returns the count using the query

db.orders.count()
db.orders.count( { ord_dt: { $gt: new Date('01/01/2012') } } )

db.orders.find( { ord_dt: { $gt: new Date('01/01/2012') } } ).count()

// Aggregation with zip code data

db.zipcodes.insertOne({
    "_id": "10280",
    "city": "NEW YORK",
    "state": "NY",
    "pop": 5574,
    "loc": [
      -74.016323,
      40.710537
    ]
  })

//   Returning states with population above 10 Million
db.zipcodes.aggregate([
    {
        $group: {
            _id: {state: "$state"},
            totalPopulation: {
                $sum: "$pop"
            }
        }
    },
    {
        $match: {
            "totalPopulation": {
                "$gte": 5000
            }
        }
    }
])

// Return average city population by state
db.zipcodes.agggregate([

])

// Return largest and smallest cities by state
db.zipcodes.aggregate([
{
    $group: {
        "_id": {state: "$state", city: "$city"},
        totalPopulation : {
            "$sum": "$pop"
        }
    }
},
    {
        $sort: {
            "_id.state": 1, "totalPopulation":1
        }
    }
])

// Aggregation With User Preference Data
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

db.users.aggregate([
    {
        $project: {
            name: {$toUpper: "$_id"}, _id:0
        }
    },
    {
        $sort: {
            name:1
        }
    }
])

// Return usernames ordered by join month
db.users.aggregate([
    
{
    $project: {
        username: "$_id",
        month_joined: {$month: "$joined"},
        _id:0

    }
}
])

// Returning the total number of joines per month
// group by the month and then do a count
db.users.aggregate([
    {
        $addFields: {
            month: {
                $month : "$joined"
            }
        }
    },
    {
        $group: {
            _id : {month: "$month"},
            totalJoinsPerMonth: {
                $sum: 1
            }
        }
    }
])



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
// Returnt the five most common likes
// unwind it on likes
// group by likes
// sort by the totalCounts
// limit 5
db.users.aggregate([
    {
        $unwind: {
            path: "$likes",
            // includeArrayIndex:"like"
        }
    },
    {
        $group : {
            _id: "$likes",
            totalLikes: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            "totalLikes": -1
        }
    },
    {
        $limit: 5
    }
])

// Double Unwind
