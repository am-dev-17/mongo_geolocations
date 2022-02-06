db.collection.insert()
// this insert command will insert documents into a collection

db.products.insert( { item: "card", qty: 15 } )

// output will be 
// { "_id" : ObjectId("5063114bd386d8fadbd6b004"), "item" : "card", "qty" : 15 }

db.products.insert( { _id: 10, item: "box", qty: 20 } )
// { "_id" : 10, "item" : "box", "qty" : 20 }

// Inserting multiple documents with insert()

db.products.insert(
    [
      { _id: 11, item: "pencil", qty: 50, type: "no.2" },
      { item: "pen", qty: 20 },
      { item: "eraser", qty: 25 }
    ]
 )

//  { "_id" : 11, "item" : "pencil", "qty" : 50, "type" : "no.2" }
// { "_id" : ObjectId("51e0373c6f35bd826f47e9a0"), "item" : "pen", "qty" : 20 }
// { "_id" : ObjectId("51e0373c6f35bd826f47e9a1"), "item" : "eraser", "qty" : 25 }

db.products.insert(
    [
      { _id: 20, item: "lamp", qty: 50, type: "desk" },
      { _id: 21, item: "lamp", qty: 20, type: "floor" },
      { _id: 22, item: "bulk", qty: 100 }
    ],
    { ordered: false }
 )

 db.products.insert(
    { item: "envelopes", qty : 100, type: "Clasp" },
    { writeConcern: { w: 2, wtimeout: 5000 } }
)

WriteResult({ "nInserted" : 1 })

// WriteResult({
//     "nInserted" : 1,
//     "writeConcernError"({
//        "code" : 64,
//        "errmsg" : "waiting for replication timed out",
//        "errInfo" : {
//          "wtimeout" : true,
//          "writeConcern" : {    // Added in MongoDB 4.4
//            "w" : "majority",
//            "wtimeout" : 100,
//            "provenance" : "getLastErrorDefaults"
//          }
//        }
//   })

// WriteResult({
//     "nInserted" : 0,
//     "writeError" : {
//        "code" : 11000,
//        "errmsg" : "insertDocument :: caused by :: 11000 E11000 duplicate key error index: test.foo.$_id_  dup key: { : 1.0 }"
//     }
//  })

db.collection.insertOne()
try {
    db.products.insertOne( { item: "card", qty: 15 } );
 } catch (e) {
    print (e);
 };

 ontimeupdate(
 {
    "acknowledged" : true,
    "insertedId" : ObjectId("56fc40f9d735c28df206d078")
 }

 )

 try {
    db.products.insertOne(
        { "item": "envelopes", "qty": 100, type: "Self-Sealing" },
        { writeConcern: { w : "majority", wtimeout : 100 } }
    );
 } catch (e) {
    print (e);
 }

 WriteConcernError({
    "code" : 64,
    "errmsg" : "waiting for replication timed out",
    "errInfo" : {
      "wtimeout" : true,
      "writeConcern" : {    // Added in MongoDB 4.4
        "w" : "majority",
        "wtimeout" : 100,
        "provenance" : "getLastErrorDefaults"
      }
    }
 })

 db.collection.insertMany()

//  db.collection.insertMany(
//     [ <document 1> , <document 2>, ... ],
//     {
//        writeConcern: <document>,
//        ordered: <boolean>
//     }
//  )


try {
    db.products.insertMany( [
       { item: "card", qty: 15 },
       { item: "envelope", qty: 20 },
       { item: "stamps" , qty: 30 }
    ] );
 } catch (e) {
    print (e);
 }
outerHeight(
    {
        "acknowledged" : true,
        "insertedIds" : [
           ObjectId("562a94d381cb9f1cd6eb0e1a"),
           ObjectId("562a94d381cb9f1cd6eb0e1b"),
           ObjectId("562a94d381cb9f1cd6eb0e1c")
        ]
     }
)


exception(
    BulkWriteError({
        "writeErrors" : [
           {
              "index" : 0,
              "code" : 11000,
              "errmsg" : "E11000 duplicate key error collection: inventory.products index: _id_ dup key: { : 13.0 }",
              "op" : {
                 "_id" : 13,
                 "item" : "stamps",
                 "qty" : 110
              }
           }
        ],
        "writeConcernErrors" : [ ],
        "nInserted" : 1,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 0,
        "upserted" : [ ]
     })
)

// db.collection.save() updates an existing document or inserts a new document, depending on its document parameter.
// Updates an existing document or inserts a new document, depending on its document parameter.

// If the document does not contain an _id field, then the save() method calls the insert() method. During the operation, the mongo shell will create an ObjectId and assign it to the _id field.

// If the document contains an _id field, then the save() method is equivalent to an update with the upsert option set to true and the query predicate on the _id field.

db.products.save( { item: "book", qty: 40 } )

db.products.save( { _id: 100, item: "water", qty: 30 } )

// { "_id" : 100, "item" : "water", "qty" : 30 }

