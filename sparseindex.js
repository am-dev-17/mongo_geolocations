// Sparse indexes will allow for only documents that contain the full key to be indexed
db.addresses.createIndex(
    {"xmpp_id": 1},
    {sparse: true}
)

db.collection.insertOne( { _id: 1, y: 1 } );
db.collection.createIndex( { x: 1 }, { sparse: true } );
db.collection.find().hint( { x: 1 } ).count();

// Sparse compound indexes that only contain ascending/descending index keys will index a document as long as the document contains at least one of the keys.
// For sparse compound indexes that contain a geospatial key (i.e. 2dsphere, 2d, or geoHaystack index keys) along with ascending/descending index key(s), only t
// he existence of the geospatial field(s) in a document determine whether the index references the document.

db.scores.insertMany([
    { "_id" : ObjectId("523b6e32fb408eea0eec2647"), "userid" : "newbie" },
{ "_id" : ObjectId("523b6e61fb408eea0eec2648"), "userid" : "abby", "score" : 82 },
{ "_id" : ObjectId("523b6e6ffb408eea0eec2649"), "userid" : "nina", "score" : 90 }
])

db.scores.createIndex(
    {score: 1},
    {sparse :true}
)


db.scores.find(
    {score : {
        $gt: 83,
        $lt: 91
    }}
)


