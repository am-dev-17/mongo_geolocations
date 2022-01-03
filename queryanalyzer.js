// Analyze Query Performance of MongoDB queries
db.inventory.insertMany([
    { "_id" : 1, "item" : "f1", type: "food", quantity: 500 },
{ "_id" : 2, "item" : "f2", type: "food", quantity: 100 },
{ "_id" : 3, "item" : "p1", type: "paper", quantity: 200 },
{ "_id" : 4, "item" : "p2", type: "paper", quantity: 150 },
{ "_id" : 5, "item" : "f3", type: "food", quantity: 300 },
{ "_id" : 6, "item" : "t1", type: "toys", quantity: 500 },
{ "_id" : 7, "item" : "a1", type: "apparel", quantity: 250 },
{ "_id" : 8, "item" : "a2", type: "apparel", quantity: 400 },
{ "_id" : 9, "item" : "t2", type: "toys", quantity: 50 },
{ "_id" : 10, "item" : "f4", type: "food", quantity: 75 },
])

// querying without an index
db.inventory.find(
    {quantity: {
        $gte: 100, $lte: 200
    }}
)

// Lets view the query plan now
db.inventory.find(
    {quantity: {
        $gte: 100, $lte: 200
    }}
).explain('executionStats')

// look for the winningPLan option and colscan is a full collection scan

db.inventory.createIndex(
    {quantity: 1}
)

db.inventory.find(
    {
        quantity: {
            $lte: 200,
            $gte: 100
        }
    }
).explain('executionStats') //IXSCAN was used here and we can see this index was used


// MongoDB Query Plans
// the query plan is chosen by comparing all possible query plans and choosing the one with least number of work units

// Covered Queries
// When the query criteria and the projection expresison contain only fields from a certain query, then the result is provided from the
// index itself and it does not have to look it up by going to documents.

// Index Intersection
// Index intersection will mean that the query will try to use multiple indexes to fulfill the query where the indexes are separate
