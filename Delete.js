// Expire data from collections by setting TTL
// Mongodb will automatically remove the data after a specified number of seconds or at a specific clock time

// To create a TTL index, use the db.collection.createIndex() method with the expireAfterSeconds

// Expire Documents after a Specified Number of Seconds
db.log_events.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 10 } )

db.log_events.insertOne( {
    "createdAt": new Date(),
    "logEvent": 2,
    "logMessage": "Success!"
 } )

//  
// Expire Documents at a Specific Clock Time
db.log_events.createIndex( { "expireAt": 1 }, { expireAfterSeconds: 0 } )

db.log_events.insertOne( {
    "expireAt": new Date('July 22, 2013 14:00:00'),
    "logEvent": 2,
    "logMessage": "Success!"
 } )


//  
