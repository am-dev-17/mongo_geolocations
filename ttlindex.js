// Automatically remove documents from a collection after a certain amount of time or at a specific clock time
db.eventLog.createIndex(
    {lastModifiedDate: 1},
    {expireAfterSeconds: 3600}
)
// Background task removes the data every 60 seconds

db.log_events.insertOne( {
    "createdAt": new Date(),
    "logEvent": 2,
    "logMessage": "Success!"
 } )

 db.log_events.createIndex(
     {
         "createdAt": 1
     },
     {
         expireAfterSeconds: 10
     }
 )

//  Expire at a specific clocktime
db.log_events.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )

db.log_events.insertOne({
    expireAt: new Date('July 22, 2012 14:00:00'),
    logEvent: 2,
    logMessage: "Success!"
})

// Hidden Indexes
// Hidden indexes are not visible to the query planner and cannot be used to support a query
// Users can evaluate the potential effects of dropping an index without actually dropping it

db.addresses.createIndex(
    {borough: 1},
    {hidden :true}
)

db.restaurants.hideIndex( { borough: 1, ratings: 1 } ); // Specify the index key specification document

db.restaurants.unhideIndex( { borough: 1, city: 1 } );  // Specify the index key specification document

// Case insensitive indexes
// Supports queries that perform string comparisions without regard for case.
db.collection.createIndex(
    {key: 1},
    {
        collation : {
            locale: 'FA',
            strength: 2
        }
    }
)

