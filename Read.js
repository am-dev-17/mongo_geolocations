db.collection.find()
db.collection.findAndModify()

// Find all documents in a collection
db.bios.find()

db.bios.find({_id: 5}).pretty()

db.bios.find({"name.last": "Hopper"})

// $in operator
db.bios.find(
    { _id: { $in: [ 5, ObjectId("507c35dd8fada716c89d0013") ] } }
 )

// going to check if the _id is equal to anything $in the array

db.bios.find(
    {birth: {
        $gt: new Date('1950-01-01')
    }}
).pretty()


db.bios.find(
    {"name.last": {
        $regex: /^N/
    }}
).pretty()

// Queries for ranges
db.bios.find(
    {
        birth : {
            $gt: new Date("1940-01-01"),
            $lt: new Date("1960-01-01")
        }
    }
).pretty()

// Query for multiple conditions
db.bios.find({
    "birth": {
        $gt: new Date('1920-01-01')
    },
    death: {$exists: false}
}).pretty()

// Query Exact Matches on Embedded Documents
db.bios.find(
    { name: { first: "Yukihiro", last: "Matsumoto" } }
)

// {
//     first: "Yukihiro",
//     aka: "Matz",
//     last: "Matsumoto"
//  }
 
//  {
//     last: "Matsumoto",
//     first: "Yukihiro"
//  }

db.bios.find(
    {
      "name.first": "Yukihiro",
      "name.last": "Matsumoto"
    }
 ).pretty()

// Query Arrays


db.bios.find( { contribs: "UNIX" } ).pretty()

db.bios.find( { contribs: { $in: [ "ALGOL", "Lisp" ]} } )

db.bios.find( { contribs: { $all: [ "ALGOL", "Lisp" ] } } )

db.bios.find( { contribs: { $size: 4 } } )


// Query an array of documents
db.bios.find(
    { "awards.award": "Turing Award" }
 )

 db.bios.find(
    { awards: { $elemMatch: { award: "Turing Award", year: { $gt: 1980 } } } }
 )


//  Projections
db.bios.find({},
    {name: 1, contribs: 1})

    db.bios.find(
        { contribs: 'OOP' },
        { 'name.first': 0, birth: 0 }
     )

     db.bios.find(
        { },
        { _id: 0, 'name.last': 1, contribs: { $slice: 2 } } )


        db.bios.find(
            { },
            { _id: 0, name: { last: 1 }, contribs: { $slice: 2 } })
// de

db.bios.find(
    { },
    {
      _id: 0,
      name: {
         $concat: [
            { $ifNull: [ "$name.aka", "$name.first" ] },
            " ",
            "$name.last"
         ]
      },
      birth: 1,
      contribs: 1,
      awards: { $cond: { if: { $isArray: "$awards" }, then: { $size: "$awards" }, else: 0 } },
      reportDate: { $dateToString: {  date: new Date(), format: "%Y-%m-%d" } },
      reportBy: "hellouser123",
      reportNumber: { $literal: 1 }
    }
 )

//  Iterating the returned cursor
var myCursor = db.bios.find( );

myCursor

var myCursor = db.bios.find( );

var myDocument = myCursor.hasNext() ? myCursor.next() : null;

if (myDocument) {
    var myName = myDocument.name;
    print (tojson(myName));
}

db.bios.find().sort( { name: 1 } )
db.bios.find().limit( 5 )

db.bios.find().skip( 5 )

db.bios.find( { "name.last": "hopper" } ).collation( { locale: "en_US", strength: 1 } )

db.collection.findAndModify()

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

db.bios.findOne()

db.bios.findOne(
    {
      $or: [
             { 'name.first' : /^G/ },
             { birth: { $lt: new Date('01/01/1945') } }
           ]
    }
 )

 db.bios.findOne(
    { },
    { name: 1, contribs: 1 }
)

db.inventory.insertMany([
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
 ]);

 db.inventory.find( { $or: [ { status: "A" }, { qty: { $lt: 30 } } ] } )

 db.inventory.find(
     {
         $or: [
             {status: "A"},
             {qty: {$lt: 30}}
         ]
     }
 )

 db.inventory.find( {
    status: "A",
    $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
} )

// Query on embedded/nested fields
db.inventory.insertMany( [
    { item: "journal", qty: 25, size: { h: 14, w: 21, uom: "cm" }, status: "A" },
    { item: "notebook", qty: 50, size: { h: 8.5, w: 11, uom: "in" }, status: "A" },
    { item: "paper", qty: 100, size: { h: 8.5, w: 11, uom: "in" }, status: "D" },
    { item: "planner", qty: 75, size: { h: 22.85, w: 30, uom: "cm" }, status: "D" },
    { item: "postcard", qty: 45, size: { h: 10, w: 15.25, uom: "cm" }, status: "A" }
 ]);

 db.inventory.find(
     {size: {
         h:14, w:21 , uom: "cm"
     }}
 )

 db.inventory.find( { "size.uom": "in" } )

//
db.inventory.find( { "size.uom": "in" } )

db.inventory.find( { "size.h": { $lt: 15 } } )

db.inventory.insertMany([
    { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
    { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
    { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
    { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
    { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] }
 ]);

//
db.inventory.find(
    {tags: {
        $all: ["red", "blank"]
    }}
)

// $all means that the array must contain all of them to match the query

// Query an array for an element
db.inventory.find( { dim_cm: { $gt: 25 } } )

// Specify multiple conditions for array documents
db.inventory.find( { dim_cm: { $gt: 15, $lt: 20 } } )

db.inventory.find( { dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } } } )

// Query for an element by the array index positon
db.inventory.find( { "dim_cm.1": { $gt: 25 } } )

db.inventory.find( { "tags": { $size: 3 } } )

// Query an array of embedded documents
db.inventory.insertMany( [
    { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
    { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
    { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
    { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
    { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
 ]);

 db.inventory.find( { "instock": { warehouse: "A", qty: 5 } } )

// Specify a Query Condition on a Field in an Array of Documents
db.inventory.find( { 'instock.qty': { $lte: 20 } } )
db.inventory.find( { 'instock.0.qty': { $lte: 20 } } )

//Specify Multiple Conditions for Array of Documents
// $elemMatch is going to allow for you to match on all of the criteria on one element
db.inventory.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } )

db.inventory.find( { "instock.qty": { $gt: 10,  $lte: 20 } } )

db.inventory.insertMany( [
    { item: "journal", status: "A", size: { h: 14, w: 21, uom: "cm" }, instock: [ { warehouse: "A", qty: 5 } ] },
    { item: "notebook", status: "A",  size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "C", qty: 5 } ] },
    { item: "paper", status: "D", size: { h: 8.5, w: 11, uom: "in" }, instock: [ { warehouse: "A", qty: 60 } ] },
    { item: "planner", status: "D", size: { h: 22.85, w: 30, uom: "cm" }, instock: [ { warehouse: "A", qty: 40 } ] },
    { item: "postcard", status: "A", size: { h: 10, w: 15.25, uom: "cm" }, instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
  ]);
// Returning all fields matching document

db.inventory.find( { status: "A" } )

db.inventory.find( { status: "A" }, { item: 1, status: 1 } )

db.inventory.find( { status: "A" }, { item: 1, status: 1, _id: 0 } )

db.inventory.find( { status: "A" }, { status: 0, instock: 0 } )

db.inventory.find(
    { status: "A" },
    { item: 1, status: 1, "size.uom": 1 }
 )

 db.inventory.find(
    { status: "A" },
    { "size.uom": 0 }
 )

// 
db.inventory.find( { status: "A" }, { item: 1, status: 1, "instock.qty": 1 } )

// Project Specific Array Elements in the Returned Array

