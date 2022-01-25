// Correct use the insert save update and findAndModify commands to create new documents
// Match insert commands with descriptions of what they do
// insert -> Going to insert a record
// insertMany
// update is going to update the correlating documents
// findAndModify is going to find the existing document return and modify it

// _id is a field that is required
// timestamp value + random value + incrementing counter 

x = ObjectId()
ObjectId("61eead793ed525879dd2cbce")

db.collection.insert()
db.inventory.insertOne(
    {
        item: "canvas",
        qty: 100,
        tags: ["cotton"],
        size: {h: 28, w:35.5, uom:"cm"}
    }
)

db.inventory.find(
    {item: "canvas"}
)

// { "_id" : ObjectId("61eeae153ed525879dd2cbcf"), "item" : "canvas", "qty" : 100, "tags" : [ "cotton" ], "size" : { "h" : 28, "w" : 35.5, "uom" : "cm" } }
db.inventory.find(
    {
        qty: {
            $lt: 22
        }
    }
)


db.inventory.insertMany([
    { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
    { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
    { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
 ])

db.inventory.find() 

db.products.insertOne( { item: "card", qty: 15 } );

try {
    db.products.insertOne(
        { "item": "envelopes", "qty": 100, type: "Self-Sealing" },
        { writeConcern: { w : "majority", wtimeout : 100 } }
    );
 } catch (e) {
    print (e);
 }

 db.collection.insert()

 db.products.insert( { item: "card", qty: 15 } )

 db.products.insert(
    [
      { _id: 11, item: "pencil", qty: 50, type: "no.2" },
      { item: "pen", qty: 20 },
      { item: "eraser", qty: 25 }
    ]
 )

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

// insertMany()
// If ordered is set to false, documents are inserted in an unordered format and may be reordered by mongod to increase performance. 
// Inserts throw a BulkWriteError exception.

try {
    db.products.insertMany( [
       { item: "card", qty: 15 },
       { item: "envelope", qty: 20 },
       { item: "stamps" , qty: 30 }
    ] );
 } catch (e) {
    print (e);
 }

 try {
    db.products.insertMany( [
       { _id: 10, item: "large box", qty: 20 },
       { _id: 11, item: "small box", qty: 55 },
       { _id: 12, item: "medium box", qty: 30 }
    ] );
 } catch (e) {
    print (e);
 }


try {
   db.products.insertMany( [
      { _id: 13, item: "envelopes", qty: 60 },
      { _id: 13, item: "stamps", qty: 110 },
      { _id: 14, item: "packing tape", qty: 38 }
   ] );
} catch (e) {
   print (e);
}
//This is a BulkWriteError
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

// Unordered Inserts -> 

try {
    db.products.insertMany( [
       { _id: 10, item: "large box", qty: 20 },
       { _id: 11, item: "small box", qty: 55 },
       { _id: 11, item: "medium box", qty: 30 },
       { _id: 12, item: "envelope", qty: 100},
       { _id: 13, item: "stamps", qty: 125 },
       { _id: 13, item: "tape", qty: 20},
       { _id: 14, item: "bubble wrap", qty: 30}
    ], { ordered: false } );
 } catch (e) {
    print (e);
 }

 BulkWriteError({
    "writeErrors" : [
       {
          "index" : 2,
          "code" : 11000,
          "errmsg" : "E11000 duplicate key error collection: inventory.products index: _id_ dup key: { : 11.0 }",
          "op" : {
             "_id" : 11,
             "item" : "medium box",
             "qty" : 30
          }
       },
       {
          "index" : 5,
          "code" : 11000,
          "errmsg" : "E11000 duplicate key error collection: inventory.products index: _id_ dup key: { : 13.0 }",
          "op" : {
             "_id" : 13,
             "item" : "tape",
             "qty" : 20
          }
       }
    ],
    "writeConcernErrors" : [ ],
    "nInserted" : 5,
    "nUpserted" : 0,
    "nMatched" : 0,
    "nModified" : 0,
    "nRemoved" : 0,
    "upserted" : [ ]
 })


try {
   db.products.insertMany(
      [
         { _id: 10, item: "large box", qty: 20 },
         { _id: 11, item: "small box", qty: 55 },
         { _id: 12, item: "medium box", qty: 30 }
      ],
      { w: "majority", wtimeout: 100 }
   );
} catch (e) {
   print (e);
}

// {
//     "acknowledged" : true,
//     "insertedIds" : [
//        ObjectId("562a94d381cb9f1cd6eb0e1a"),
//        ObjectId("562a94d381cb9f1cd6eb0e1b"),
//        ObjectId("562a94d381cb9f1cd6eb0e1c")
//     ]
//   }

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



//  save()
// save() is going to update an existing document or insert a new document depending on its document parameter

// update() db.collection.update() will insert new documents in the collection if upsert is set to true and no document matches the query criteria
// By default, the db.collection.update() method updates a single document. Include the option multi: true to update all documents that match the query criteria.


// db.collection.update(
//     <query>,
//     <update>,
//     {
//       upsert: <boolean>,
//       multi: <boolean>,
//       writeConcern: <document>,
//       collation: <document>,
//       arrayFilters: [ <filterdocument1>, ... ],
//       hint:  <document|string>, // Added in MongoDB 4.2
//       let: <document> // Added in MongoDB 5.0
//     }
//  )

db.books.remove({});

db.books.insertMany([
  {
    "_id" : 1,
    "item" : "TBD",
    "stock" : 0,
    "info" : { "publisher" : "1111", "pages" : 430 },
    "tags" : [ "technology", "computer" ],
    "ratings" : [ { "by" : "ijk", "rating" : 4 }, { "by" : "lmn", "rating" : 5 } ],
    "reorder" : false
   },
   {
    "_id" : 2,
    "item" : "XYZ123",
    "stock" : 15,
    "info" : { "publisher" : "5555", "pages" : 150 },
    "tags" : [ ],
    "ratings" : [ { "by" : "xyz", "rating" : 5 } ],
    "reorder" : false
   }
]);

db.books.update(
    {stock: {$lte: 10}},
    {$set: {reorder: true}},
    {multi:true}
    )

    db.books.update(
        { item: "BLP921" },   // Query parameter
        {                     // Update document
           $set: { reorder: false },
           $setOnInsert: { stock: 10 }
        },
        { upsert: true }      // Options
     )

     db.students.insertMany( [
        { _id: 1, test1: 95, test2: 92, test3: 90, modified: new Date("01/05/2020") },
        { _id: 2, test1: 98, test2: 100, test3: 102, modified: new Date("01/05/2020") },
        { _id: 3, test1: 95, test2: 110, modified: new Date("01/04/2020") }
     ] )


     db.students.updateOne( { _id: 3 }, [ { $set: { "test3": 98, modified: "$$NOW"} } ] )

db.students.updateOne(
    {_id: 3},
    [
        {$set: {
            test3: 98, modified: "$$NOW"
        }}
    ]
)

db.students2.insertMany( [
    { "_id" : 1, quiz1: 8, test2: 100, quiz2: 9, modified: new Date("01/05/2020") },
    { "_id" : 2, quiz2: 5, test1: 80, test2: 89, modified: new Date("01/05/2020") },
 ] )

 db.students2.updateMany( {},
    [
      { $replaceRoot: { newRoot:
         { $mergeObjects: [ { quiz1: 0, quiz2: 0, test1: 0, test2: 0 }, "$$ROOT" ] }
      } },
      { $set: { modified: "$$NOW"}  }
    ]
  )

//findAndModify
db.people.findAndModify({
    query: { name: "Tom", state: "active", rating: { $gt: 10 } },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } }
})

db.people.findAndModify({
    query: { name: "Gus", state: "active", rating: 100 },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } },
    upsert: true
})

db.people.findAndModify({
    query: { name: "Pascal", state: "active", rating: 25 },
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


 db.myColl.findAndModify({
    query: { category: "cafe", status: "a" },
    sort: { category: 1 },
    update: { $set: { status: "Updated" } },
    collation: { locale: "fr", strength: 1 }
});

db.students.insertMany( [
    { "_id" : 1, "grades" : [ 95, 92, 90 ] },
    { "_id" : 2, "grades" : [ 98, 100, 102 ] },
    { "_id" : 3, "grades" : [ 95, 110, 100 ] }
 ] )

 db.students.findAndModify({
    query: { grades: { $gte: 100 } },
    update: { $set: { "grades.$[element]" : 100 } },
    arrayFilters: [ { "element": { $gte: 100 } } ]
 })


 db.students2.insertMany( [
    {
       "_id" : 1,
       "grades" : [
          { "grade" : 80, "mean" : 75, "std" : 6 },
          { "grade" : 85, "mean" : 90, "std" : 4 },
          { "grade" : 85, "mean" : 85, "std" : 6 }
       ]
    },
    {
       "_id" : 2,
       "grades" : [
          { "grade" : 90, "mean" : 75, "std" : 6 },
          { "grade" : 87, "mean" : 90, "std" : 3 },
          { "grade" : 85, "mean" : 85, "std" : 4 }
       ]
    }
 ] )

 db.students2.findAndModify({
    query: { _id : 1 },
    update: { $set: { "grades.$[elem].mean" : 100 } },
    arrayFilters: [ { "elem.grade": { $gte: 85 } } ]
 })


 db.cakeFlavors.findAndModify( {
    query: {
       $expr: { $eq: [ "$flavor", "$$targetFlavor" ] }
    },
    update: { flavor: "orange" },
    let: { targetFlavor: "cherry" }
 } )


db.people.findAndModify({
    query: { name: "Gus", state: "active", rating: 100 },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } },
    upsert: true
})

db.people.findAndModify({
    query: { name: "Pascal", state: "active", rating: 25 },
    sort: { rating: 1 },
    update: { $inc: { score: 1 } },
    upsert: true,
    new: true
})


> db.foo.update( { a : 5, b : { $lte : 7 } }, { $set : { c : 8 } }, { upsert : true } )
WriteResult({
    "nMatched" : 0,
    "nUpserted" : 1,
    "nModified" : 0,
    "_id" : ObjectId("55b0200e5ef34083de46367e")
})
> db.foo.find()
// { "_id" : ObjectId("55b0200e5ef34083de46367e"), "a" : 5, "c" : 8 }

