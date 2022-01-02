// The aggregation framework is used to aggregate data
db.companies.insertMany([
    {
        "_id": "52cdef7c4bab8bd675297d8e",
        "name": "Facebook",
        "category_code": "social",
        "founded_year": 2004,
        "description": "Social network",
        "funding_rounds": [
            {
                "id": 4,
                "round_code": "b",
                "raised_amount": 27500000,
                "raised_currency_code": "USD",
                "funded_year": 2006,
                "investments": [
                    {
                        "company": null,
                        "financial_org": {
                            "name": "Greylock Partners",
                            "permalink": "greylock"
                        },
                        "person": null
                    },
                    {
                        "company": null,
                        "financial_org": {
                            "name": "Meritech Capital Partners",
                            "permalink": "meritech-capital-partners"
                        },
                        "person": null
                    },
                    {
                        "company": null,
                        "financial_org": {
                            "name": "Founders Fund",
                            "permalink": "founders-fund"
                        },
                        "person": null
                    },
                    {
                        "company": null,
                        "financial_org": {
                            "name": "SV Angel",
                            "permalink": "sv-angel"
                        },
                        "person": null
                    }
                ]
            },
            {
                "id": 2197,
                "round_code": "c",
                "raised_amount": 15000000,
                "raised_currency_code": "USD",
                "funded_year": 2008,
                "investments": [
                    {
                        "company": null,
                        "financial_org": {
                            "name": "European Founders Fund",
                            "permalink": "european-founders-fund"
                        },
                        "person": null
                    }
                ]
            }
        ],
        "ipo": {
            "valuation_amount": NumberLong("104000000000"),
            "valuation_currency_code": "USD",
            "pub_year": 2012,
            "pub_month": 5,
            "pub_day": 18,
            "stock_symbol": "NASDAQ:FB"
        }
    }
])



db.companies.aggregate([
    {
        $match :{
            founded_year: 2004
    }
},
{$limit: 5},
{
    $project: {
        _id: 0,
        name: 1
    }
}
])


db.companies.aggregate([
    {
        $match: {
            founded_year: 2004
        }
    },
    {
        $sort: {name: 1}
    },
    {
        $limit : 5
    },
    {$project: {
        _id: 0,
        name: 1
    }}
])

db.companies.aggregate([
    {
        $match : {
            founded_year: 2004
        }
    },
    {
        $sort: {name: 1}
    },
    {
        $skip: 2
    },
    {
        $project: {
            _id: 0,
            name: 1
        }
    }
])


// Expressions
// $project
db.companies.aggregate([
    {
        $match: {"funding_rounds.investments.financial_org.permalink": "greylock" }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            ipo: "$ipo.pub_year",
            valuation: "$ipo.valuation_amount",
            funders: "$funding_rounds.investments.financial_org.permalink"
        }
    }
]).pretty()

db.companies.aggregate([
    {
        $match : {
            "funding_rounds.investments.financial_org.permalink": "greylock"
        }
    },
    {
        $project: {
            _id:0,
            name: 1,
            valuation: "$ipo.valuation_amount",
            funders: "$funding_rounds.investments.financial_org.permalink"
        }
    }
])

// $unwind
db.companies.aggregate([
    {
        $match: {"funding_rounds.investments.financial_org.permalink": "greylock"}
    },
    {
        $unwind: "$funding_rounds"
    },
    {
        $match : {"funding_rounds.investments.financial_org.permalink": "greylock"}
    },
    {
        $project: {
            _id: 0,
            name: 1,
            individualFunder: "$funding_rounds.investments.person.permalink",
            funder: "$funding_rounds.investments.financial_org.permalink",
            amount: "$funding_rounds.raised_amount",
            year: "$funding_rounds.funded_year"
        }
    }
])



// Array Expressions
// Array expression in project stages
db.companies.aggregate([
    {
        $match : {
            "funding_rounds.investments.financial_org.permalink": "greylock"
        }
    },
    {
        $project : {
            _id: 0,
            name: 1,
            founded_year: 1,
            rounds: {
                $filter: {
                    input: "$funding_rounds",
                    as: "round",
                    cond: {$gte :["$$round.raised_amount", 1000000]}
                }
            },
        },
        
    },
    {
        $match: {"rounds.investments.financial_org.permalink": "greylock"}
    }
])

db.companies.aggregate([
    {
        $match : {"founded_year": 2004}
    },
    {
        $project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            first_round: {
                $arrayElemAt: ["$funding_rounds", 0]
            },
            last_round: {
                $arrayElemAt: ["$funding_rounds", -1]
            }
        }
    }
]).pretty()

// $slice expression
// $slice allows us to return multiple items from an array in sequence
db.companies.aggregate([
    {
        $match :{
            founded_year: 2004
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            early_rounds: {
                $slice: [
                    "$funding_rounds", 1,3
                ]
            }
        }
    }
]).pretty()

// Size of an array
db.companies.aggregate([
    {
        $match : {
            "founded_year": 2004
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            founded_year: 1,
            number_investors : {
                $size : "$funding_rounds"
            }
        }
    }
]).pretty()

// Accumulators
// Accumulators calculate fields from values found in multiple documents

// Using Accumulators in Project stages
db.companies.aggregate([
    {
        $match: {
            "funding_rounds": {
                $exists: true,
                $ne: []
            }
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            largest_round: {
                $max: "$funding_rounds.raised_amount"
            }
        }
    }
])


db.companies.aggregate([
    {
        $match: {
            "funding_rounds" : {
                $exists: true,
                $ne: []
            }
        }
    },
    {
        $project: {
            _id: 0,
            name: 1,
            total_amount: {
                $sum : "$funding_rounds.raised_amount"
            }
        }
    }
])

// Introduction to Grouping
db.companies.aggregate([
    {
        $group : {
            _id: {
                founded_year: "$founded_year"
            },
            average_founded_year : {
                $avg: "$founded_year"
            }
        }
    }
])

db.companies.aggregate([
    {
        $match: {
            "relationship.person": {
                $ne: null
            }
        }
    },
    {
        $project: {
            relationships: 1,
            _id: 0
        }
    },
    {
        $unwind : "$relationships"
    },
    {
        $group :{
            _id: "$relationships.person",
            count: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            count: -1
        }
    }
]).pretty()


// Group vs Project
// $push and others are only available in the grouping stage and not the project stage

// Transaction Example
// Remember that a session must always be explicitly passed into the API for the specific transaction

orders.insertOne({
    'sku' : "abc123",
    qty: {
        $gte : 100
    }
}, session=session)

inventory.insertOne({
    sku: "abc123",
    qty: {
        "$gte" : 100
    }},
    session=session)


db.usersTraining.insertOne(
    {
        name: "sue",
        age: 26,
        status: "pending"
    }
)

// Read Operationg
db.usersTraining.find(
    {age: {
        $gt: 18
    }},
    {
        name: 1,
        address: 1
    }
).limit(4)


// Insert Documents
db.inventoryTraining.insertOne(
    {
        item: "canvas",
        qty: 100,
        tags: ["cotton"],
        size: {
            h: 28,
            w: 35.5,
            uom: "cm"
        }
    }
)


db.inventoryTraining.find({
    item: "canvas"
})

db.inventoryTraining.insertMany([
    {
        item: 'journal',
        qty: 25,
        tags: ["blank", "red"],
        size: {
            h: 14,
            w: 21,
            uom: "cm"
        }
    },
    {
        item: "mat",
        qty: 85,
        tags: ["gray"],
        size: {
            h: 27.0, w: 35.5, uom: "cm"
        }
    }
])

// Insert Methods

db.inventoryTrainingQuery.insertMany(
    [
        { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
        { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
        { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
        { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
        { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
     ]
)

// $in
db.inventoryTrainingQuery.find({
    status : {
        $in: [
            "A","D"
        ]
    }
})

// and
db.inventoryTrainingQuery.find({
    status: "A",
    qty: {
        $lt : 30
    }
})

// $or
db.inventoryTrainingQuery.find({
    $or : [
        {status: "A"},
        {qty: {
            $lt: 30
        }}
    ]
})

// and and or

db.inventoryTrainingQuery.find(
    {
        status: "A",
        $or : [
            {
                qty: {
                    $lt : 30
                }
            },
            {
                item: /^p/
            }
        ]
    }
)

// Querying on Embedded and nested Documents
db.collection.find({
    "asian.leah": {
        $lte : 3
    }
})

// The array must exacrly match location of the elements and all
db.inventory.find(
    {
        tags: ["blank", "red"]
    }
)

db.inventory.find({
    tags: {
        $all: ["red", "blank"]
    }
})

// Query an element for an array this will check if there is atleast one element with that value in the array
db.inventory.find({
    tags: 'red'
})

db.inventory.find({
    dim_cm : {
        $gt: 15, $lt: 20  //THIS IS AN OR
    }
})

db.inventory.find({
    dim_cm: {
        $elemMatch: {
            $gt : 24, $lte: 30
        }
    }
})

// Check a value by index
db.inventory.find({
    "dim_cm.1": {
        $gt: 25
    }
})

db.inventory.find({
    tags: {
        $size: 3
    }
})

// Query an array of embedded documents
db.inventory.insertMany( [
    { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
    { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
    { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
    { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
    { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
 ]);

// Remember that this is the exact match
 db.inventory.find({
     instock: {
         warehouse: "A",
         qty: 5
     }
 })

// This will be the functionality that we want
 db.inventory.find({
     "instock.warehouse": "A"
 })

 db.inventory.find({
     'instock.qty': {
         $lte : 20
     }
 })

 db.inventory.find({
     'inventory.0.qty': {
         $lte: 20
     }
 })

//  $elemMatch will enforce that all criterias are met on at least on element in the array
db.inventory.find({
    'instock': {
        $elemMatch :{
            qty: {
                $lte : 59,
                $gt: 39
            }
        }
    }
})

db.inventory.find({
    instock: {
        $elemMatch: {
            qty: 5,
            warehouse: 'B'
        }
    }
})


db.inventory.insertMany( [
    { item: "journal", status: "A", size: { h: 14, w: 21, uom: "cm" }, instock: [ { warehouse: "A", qty: 5 } ] },
    { item: "notebook", status: "A",  size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "C", qty: 5 } ] },
    { item: "paper", status: "D", size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "A", qty: 60 } ] },
    { item: "planner", status: "D", size: { h: 22.85, w: 30, uom: "cm" }, instock: [ { warehouse: "A", qty: 40 } ] },
    { item: "postcard", status: "A", size: { h: 10, w: 15.25, uom: "cm" }, instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
  ]);


  db.inventory.find({
      status: "A"
  }, {_id: 0})

  db.inventory.find({status: "A"}, {item: 1, status: 1})

//   Projection specific on Array Elements
db.inventory.find(
    {
        status: "A"
    },
    {
        item: 1,
        status: 1,
        instock: {
            $slice: 1
        }
    })

// Query for null or missing fields
db.inventory.insertMany([
    { _id: 1, item: null },
    { _id: 2 }
 ])

// this will find all documents where item is null and item field does not exist
db.inventory.find({item: null})

db.inventory.find({
    item: {
        $type: 10
    }
})

db.inventory.find({
    item :{
        $exists : true
    }
})

// Iterating a cursor in mongosh
var myCursor = db.users.find({
    type: 2
})

// Update Documents
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

//  Updating documents in a collection
db.inventory.updateOne(
    {item: "paper"},
    {
        $set: {
            "size.uom": "cm"
        },
        $currentDate: {
            lastModified: true
        }
    }
)

db.inventory.updateMany({
    qty: {
        $lt: 50
    }
},
{
    $set: {"size.uom": "in", "status": "P"},
    $currentDate: {lastModified:true}
})


// replaceOne
db.inventory.replaceOne(
    { item: "paper" },
    { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
 )


 db.scores.insertMany([
    { "_id" : 1, "team" : "Fearful Mallards", "score" : 25000 },
    { "_id" : 2, "team" : "Tactful Mooses", "score" : 23500 },
    { "_id" : 3, "team" : "Aquatic Ponies", "score" : 19250 },
    { "_id" : 4, "team" : "Cuddly Zebras", "score" : 15235 },
    { "_id" : 5, "team" : "Garrulous Bears", "score" : 18000 }
 ]);

//  findOneAndReplace
db.scores.findOneAndReplace(
    {"score": {
        $lt: 20000
    }},
    {team: "Observant Badgers", score: 20000}
    )

db.scores.findOneAndReplace(
    {score: {
        $lt: 20000
    }},
    {team: "Observant Badgers", score: 20000},
    {sort: {score: 1}}
    )

// What if we only want to project specific fields in findOneAndReplace
db.scores.findOneAndReplace(
    {score: {$lt: 22250}},
    {team: "Therapeutic Hamsters", score: 22250},
    {sort: {score: 1}, projection: {_id: 0, team: 1}}
)

// Replace a docunment with upsert
db.scores.findOneAndReplace(
    {team: "Fortified Lobsters"},
    {_id: 6019, team: "Fortified Lobsters", "score": 32000},
    {upsert: true, returnNewDocument: true}
    )

// findOneAndDelete()
db.scores.insertMany([
    { _id: 6305, name : "A. MacDyver", "assignment" : 5, "points" : 24 },
{ _id: 6308, name : "B. Batlock", "assignment" : 3, "points" : 22 },
{ _id: 6312, name : "M. Tagnum", "assignment" : 5, "points" : 30 },
{ _id: 6319, name : "R. Stiles", "assignment" : 2, "points" : 12 },
{ _id: 6322, name : "A. MacDyver", "assignment" : 2, "points" : 14 },
{ _id: 6234, name : "R. Stiles", "assignment" : 1, "points" : 10 }

])

db.scores.findOneAndDelete(
    {name: "M. Tagnum"}
)


db.scores.findOneAndDelete(
    {name: "A. MacDyver"},
    {sort: {points: 1}}
)

// Projecting the deleted document
db.scores.findOneAndDelete(
    {name: "A. MacDyver"},
    {sort: {points: 1}, projection: {assignment: 1}}
)

// findOneAndUpdate
db.grades.insertMany([
    { _id: 6305, name : "A. MacDyver", "assignment" : 5, "points" : 24 },
{ _id: 6308, name : "B. Batlock", "assignment" : 3, "points" : 22 },
{ _id: 6312, name : "M. Tagnum", "assignment" : 5, "points" : 30 },
{ _id: 6319, name : "R. Stiles", "assignment" : 2, "points" : 12 },
{ _id: 6322, name : "A. MacDyver", "assignment" : 2, "points" : 14 },
{ _id: 6234, name : "R. Stiles", "assignment" : 1, "points" : 10 }

])

db.grades.findOneAndUpdate(
    {name: "R. Stiles"},
    {$inc :{points: 5}},
    {returnNewDocument: true, sort: {points: 1}}
)

// Update a document with upsert
// upsert: true

// findAndModify()

// delete Operations

db.inventory.insertMany( [
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "P" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" },
 ] );

 db.inventory.deleteMany({})

//  Bulk Write Operations
// Bulk write operations are only possible for a single collection
// bulk insert update and remove operations are possible
// during an ordered bulk write, the records will be inserted serially and if one fails, then the remaining records will not be inserted
// for unordered bulk write the order will not matter and if one record fails, then the remainder will still be tried.

// db.collection.bulkWrite()
// bulkwrite by default performs ordered operations
// use ordered: false for unordered operations

db.characters.insertMany([
    { "_id" : 1, "char" : "Brisbane", "class" : "monk", "lvl" : 4 },
{ "_id" : 2, "char" : "Eldon", "class" : "alchemist", "lvl" : 3 },
{ "_id" : 3, "char" : "Meldane", "class" : "ranger", "lvl" : 3 }
])

// Retryable writes
// mongosh --retryWrites

// Text Search

db.stores.insert(
    [
      { _id: 1, name: "Java Hut", description: "Coffee and cakes" },
      { _id: 2, name: "Burger Buns", description: "Gourmet hamburgers" },
      { _id: 3, name: "Coffee Shop", description: "Just coffee" },
      { _id: 4, name: "Clothes Clothes Clothes", description: "Discount clothing" },
      { _id: 5, name: "Java Shopping", description: "Indonesian goods" }
    ]
 )

 db.stores.createIndex({
     name: "text",
     description: 'text'
 })

 db.stores.find({
     $text: {
         $search: "java coffee shop"
     }
 })
// This is how you search for an exact phrase
 db.stores.find( { $text: { $search: "\"coffee shop\"" } } )

 db.stores.find(
     {$text: {$search: "java coffee shop"}},
     {score: {$meta: "textScore"}}
 ).sort({score:{$meta: "textScore"}})


//  Text Search operators
// $text -> $search

// Geospatial Queries
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

 db.places.createIndex( { location: "2dsphere" } )


 db.places.find(
     {
         location: {
             $near: {
                 $geometry: {type: "Point", coordinates: [-73.9687, 40.78]},
                 $minDistance: 1000,
                 $maxDistance: 5000
             }
         }
     }
 )


//  Finding Restaurants with Geospatial Queries

// Finding the neighborhood the user is in with geoIntersects

db.neighborhoods.findOne({
    geometry: {
        $geoIntersects : {
            $geometry : {
                type: "Point",
                coordinates: [ -73.93414657, 40.82302903 ]
            }
        }
    }
})

// Finding all restaurants in the neighborhood


// GeoJSON Objects
// The different shape types which are supported, point, polygon etc

// Query operators
// Comparision operators
//  $eq and $neq


// Logic operators
// $and $or $nor $not
db.collection.find(
    {
        $nor: [
            {result: "No Violation Issued"},
            {result : "Violation Issued"}
        ]
    }
)// Nor is going to return the documents that FAIL all query expressions


// Expressive Query Operator
db.collections.find({
    "$expr": {
        $eq: ["$start station id", "$end station id"]
    }
})

db.trips.find({
    "$expr": {
        $eq: ["$start station id", "$end station id"]
    }
}).count()


// You can use and for this
db.trips.find({
    $expr: {
        $and : [
            {
            $gt: ["$tripduration", 1200] // This syntax is the aggregation syntax
        },
        {$eq: ["$end station id", "$start station id"]}
    ]
    }
}).count()

// element operators
// $exits allows you to check if the field exists
// $type allows you to check the type of the field and only return the type that you want

db.movies.find({
    'mpaaRating': {
        $exists: true
    }
})

db.movies.find({
    'mpaaRating': {
        $exists: false
    }
})

db.addressBook.insertMany(
    [
       { "_id" : 1, address : "2030 Martian Way", zipCode : "90698345" },
       { "_id" : 2, address: "156 Lunar Place", zipCode : 43339374 },
       { "_id" : 3, address : "2324 Pluto Place", zipCode: NumberLong(3921412) },
       { "_id" : 4, address : "55 Saturn Ring" , zipCode : NumberInt(88602117) },
       { "_id" : 5, address : "104 Venus Drive", zipCode : ["834847278", "1893289032"]}
    ]
 )

 db.addressBook.find({
     zipCode: {
         $type: "string"
     }
 })

 db.products.insertMany([
    { "_id" : 100, "sku" : "abc123", "description" : "Single line description." },
    { "_id" : 101, "sku" : "abc789", "description" : "First line\nSecond line" },
    { "_id" : 102, "sku" : "xyz456", "description" : "Many spaces before     line" },
    { "_id" : 103, "sku" : "xyz789", "description" : "Multiple\nline description" }
 ])

//  Performing a LIKE operation with Regex
db.products.find({
    sku : {
        $regex: /789$/
    }
})

// Performing case-insensitive regex matching
// the i option will allow for caseInsensitive matching
db.products.find({
    sku :{
        $regex : '/^ABC/i'
    }
})

// count
db.orders.count()
// It is possible to pass queries inside of count
db.orders.count( { ord_dt: { $gt: new Date('01/01/2012') } } )

// distinct
db.inventory.insertMany([
    { "_id": 1, "dept": "A", "item": { "sku": "111", "color": "red" }, "sizes": [ "S", "M" ] },
{ "_id": 2, "dept": "A", "item": { "sku": "111", "color": "blue" }, "sizes": [ "M", "L" ] },
{ "_id": 3, "dept": "B", "item": { "sku": "222", "color": "blue" }, "sizes": "S" },
{ "_id": 4, "dept": "A", "item": { "sku": "333", "color": "black" }, "sizes": [ "S" ] }
])

db.inventory.distinct("dept")
db.inventory.distinct("item.sku")

db.inventory.distinct("item.sku", {dept:"A"})

// sorting
db.orders.insertMany([
    { _id: 1, item: { category: "cake", type: "chiffon" }, amount: 10 },
{ _id: 2, item: { category: "cookies", type: "chocolate chip" }, amount: 50 },
{ _id: 3, item: { category: "cookies", type: "chocolate chip" }, amount: 15 },
{ _id: 4, item: { category: "cake", type: "lemon" }, amount: 30 },
{ _id: 5, item: { category: "cake", type: "carrot" }, amount: 20 },
{ _id: 6, item: { category: "brownies", type: "blondie" }, amount: 10 }
])

db.orders.find().sort({amount: -1})

// sorting using an embedded document

db.orders.find().sort({"item.category": 1, "item.type": 1})

// Return in natural order $natural

// skip
db.orders.find().skip(3)

db.orders.find().limit(5)

// Cursors
// Iterating the cursor
var myCursor = db.users.find({type: 2})

while(myCursor.hasNext()){
    print(tojson(myCursor.next()))
}

db.collection.find({

}, {
    _id:0, hello: 1
})

// Update
db.products.save({
    item: 'book',
    qty: 40
})

db.products.save( { _id: 100, item: "water", qty: 30 } )

// Find and modify
db.people.findAndModify({
    query: { name: "Tom", state: "active", rating: { $gt: 10 } },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } }
})

db.people.findAndModify({
    query: { name: "Tom", state: "active", rating: { $gt: 10 } },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } },
    upsert: true,
    new: true
})

db.people.findAndModify(
    {
      query: { state: "active" },
      sort: { rating: 1 },
      remove: true
    }
 )

 db.myColl.insertMany([
    { category: "café", status: "A" },
    { category: "café", status: "A" },
    {  category: "cafe", status: "a" },
    {  category: "cafE", status: "a" }
 ])
// FindAndModify is only going to find and modify ONE
 db.myColl.findAndModify({
    query: { category: "cafe", status: "a" },
    sort: { category: 1 },
    update: { $set: { status: "Updated" } },
    collation: { locale: "fr", strength: 1 }
});

// FindOneAndUpdate
// The findOneAndUpdate Method
db.grades.insertMany([
    { _id: 6305, name : "A. MacDyver", "assignment" : 5, "points" : 24 },
{ _id: 6308, name : "B. Batlock", "assignment" : 3, "points" : 22 },
{ _id: 6312, name : "M. Tagnum", "assignment" : 5, "points" : 30 },
{ _id: 6319, name : "R. Stiles", "assignment" : 2, "points" : 12 },
{ _id: 6322, name : "A. MacDyver", "assignment" : 2, "points" : 14 },
{ _id: 6234, name : "R. Stiles", "assignment" : 1, "points" : 10 }
])


db.grades.findOneAndUpdate(
    {"name": "R. Stiles"},
    {$inc: {points: 5}},
    {returnNewDocument: true, sort: {points: 1}}
)

db.grades.findOneAndUpdate(
    {name: "A. MacDyver"},
    {$inc: {points: 5}},
    {sort: {points: 1}, projection: {assignment: 1, points: 1}, returnNewDocument: true}
    )


// Updating the document with an upsert
db.grades.findOneAndUpdate(
    {name: "A.B. Abracus"},
    {
        $set: {
            name: "A.B. Abracus",
            assignment: 5
        },
        $inc :{
            points: 5
        }
    },
    {
        sort: {
            points: 1
        },
        upsert: true, 
        returnNewDocument: true
    }
)

// Specify the collation
db.myColl.findOneAndUpdate(
    { category: "cafe" },
    { $set: { status: "Updated" } },
    { collation: { locale: "fr", strength: 1 } }
 );

 