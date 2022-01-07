// Data modeling
// Flexible Schema
// Embedded Data
// Remember that MongoDB is atomic at a single document level and NOT the embedded document level
// Multidocument transactions - When a single write operation (e.g. db.collection.updateMany()) modifies multiple documents, the modification of each document is atomic, but the operation as a whole is not atomic.
// For situations that require atomicity of reads and writes to multiple documents (in a single or multiple collections), MongoDB supports multi-document transactions:


// Schema Validation
db.createCollection() // validator option
// existing collection
// use the collMod with validator option

// validationLevel option, which determines how strictly MongoDB applies validation 
// rules to existing documents during an update.
// validationAction option, which determines whether MongoDB should error and reject documents that 
// violate the validation rules or warn about the violations in the log but allow invalid documents.

// JSON Schema
// Use the $jsonSchema operator in your validator expression
db.createCollection("students", {
    validator: {
       $jsonSchema: {
          bsonType: "object",
          required: [ "name", "year", "major", "address" ],
          properties: {
             name: {
                bsonType: "string",
                description: "must be a string and is required"
             },
             year: {
                bsonType: "int",
                minimum: 2017,
                maximum: 3017,
                description: "must be an integer in [ 2017, 3017 ] and is required"
             },
             major: {
                enum: [ "Math", "English", "Computer Science", "History", null ],
                description: "can only be one of the enum values and is required"
             },
             gpa: {
                bsonType: [ "double" ],
                description: "must be a double if the field exists"
             },
             address: {
                bsonType: "object",
                required: [ "city" ],
                properties: {
                   street: {
                      bsonType: "string",
                      description: "must be a string if the field exists"
                   },
                   city: {
                      bsonType: "string",
                      description: "must be a string and is required"
                   }
                }
             }
          }
       }
    }
 })

//  Other Query Expressions
// There are other validation query operators
db.createCollection( "contacts",
   { validator: { $or:
      [
         { phone: { $type: "string" } },
         { email: { $regex: /@mongodb\.com$/ } },
         { status: { $in: [ "Unknown", "Incomplete" ] } }
      ]
   }
} )

// Validation occurs during updates and inserts. 
// When you add validation to a collection, existing documents do not undergo validation checks until modification.

// Validation on existing documents
db.collection.validate()
// validationLevel STRICT will make it so that the validations are applied to any insert ot update
// validationLevel at moderate will apply all validations on inserts and all updates where the existing document fulfilled the validation


db.contacts.insertMany([
    { "_id": 1, "name": "Anne", "phone": "+1 555 123 456", "city": "London", "status": "Complete" },
    { "_id": 2, "name": "Ivan", "city": "Vancouver" }
 ])

//  now we want to issue the following command to add a validation
db.runCommand( {
    collMod: "contacts",
    validator: { $jsonSchema: {
       bsonType: "object",
       required: [ "phone", "name" ],
       properties: {
          phone: {
             bsonType: "string",
             description: "phone must be a string and is required"
          },
          name: {
             bsonType: "string",
             description: "name must be a string and is required"
          }
       }
    } },
    validationLevel: "moderate"
 } )
//These will throw an error
 db.contacts.updateOne(
    { _id: 1 },
    { $set: { name: 10 } }
 )
 
 db.contacts.updateOne(
    { _id: 2 },
    { $set: { name: 20 } }
 )

//  ValidationAction is between warn and error
db.createCollection( "contacts2", {
    validator: { $jsonSchema: {
       bsonType: "object",
       required: [ "phone" ],
       properties: {
          phone: {
             bsonType: "string",
             description: "must be a string and is required"
          },
          email: {
             bsonType : "string",
             pattern : "@mongodb\.com$",
             description: "must be a string and match the regular expression pattern"
          },
          status: {
             enum: [ "Unknown", "Incomplete" ],
             description: "can only be one of the enum values"
          }
       }
    } },
    validationAction: "warn" 
 } )
//this will warn the client that the violation occur but will not prevent the update

 db.contacts2.insertOne( { name: "Amanda", status: "Updated" } )


//  Look at the log
db.adminCommand( { getLog: "global" } )


// Use Title and Description Fields to Clarify Validation Rules
db.runCommand( {
    collMod: "users",
    validator: { $jsonSchema: {
       bsonType: "object",
       title: "Email validation",
       properties: {
          email: {
             "bsonType": "string",
             "pattern": "^@mongodb\.com$",
             "description": "Email address must end with '@mongodb.com'"
          },
       }
    } },
    validationLevel: "moderate"
 } )

//  ValidationLevel will control between strict and moderate this will influence pre-existing validation failed documents are not validated
// strict validates everything
// ValidationAction will control if the violated document is added or is it errored

// Bypassing the Document Validation
// bypassDocumentValidation


// Data Model Design Normalized vs Embedded
// Embedded documents are great for one to one relationships
// One to many relationships are great as well

// Normalized Data Models
// You will have a relationship in your document models
// When embedding would result in the duplication of data 
// Many to many relationships
// Modeling large hierrarchical datasets

// $lookup and $graphLookup are available for joining using aggregation stages

// Atomicity of write operations
// Remember that by default a Mongodb is atomic at the document level

// Transactions
// Multi-level document transactions are possible using any kind of API needed

// Data Use and Performance
// Operational Factors and Data Models

// Performance Best Practice for Data Modeling with MongoDB 

// Ensure that your working set fits into RAM
// Working set refers to the data that MongoDB uses most often


// Relational Features and MongoDB Patterns
// Database references 

// Manual references where you save the _id field of one document in another document as a reference. 
// Then your application can run a second query to return the related data. 
// These references are simple and sufficient for most use cases.

original_id = ObjectId()

db.places.insertOne({
    "_id": original_id,
    "name": "Broadway Center",
    "url": "bc.example.net"
})

db.people.insertOne({
    "name": "Erin",
    "places_id": original_id,
    "url":  "bc.example.net/Erin"
})

// Atomicity and Transactions
// Write operations are by defeault atomic at the single document level

// Multi-Document Transactions
// you must use the transaction API for multi-document transactions

// Concurrency Control
// Control concurrency by creating an unique index on a field so simultaneous rights cannot occur

// One-to-One Modeling
// One-to-One Modeling with Embedded Documents
// Embedding your one to one relationship data will allow for you to reduce read operations
db.sample({
    _id: "joe",
    name: "Joe Bookreader",
    address: {
               street: "123 Fake Street",
               city: "Faketon",
               state: "MA",
               zip: "12345"
             }
 })



//  Subset Pattern
// You can retrieve a subset of the data if that is the only data you need from the document
// Split your data by frequency and have a collection with the common data and another collection with less frequent data

// One-to-Many Relationships
// One-to-Many Relationships with Embedded Documents
embeddedOneToMany = {
    "_id": "joe",
    "name": "Joe Bookreader",
    "addresses": [
                 {
                   "street": "123 Fake Street",
                   "city": "Faketon",
                   "state": "MA",
                   "zip": "12345"
                 },
                 {
                   "street": "1 Some Other Street",
                   "city": "Boston",
                   "state": "MA",
                   "zip": "12345"
                 }
               ]
  }


// Subset Pattern is also an option if you only need to access certain hot data
reviews10MostRecent = {
    "_id": 1,
    "name": "Super Widget",
    "description": "This is the most useful item in your toolbox.",
    "price": { "value": NumberDecimal("119.99"), "currency": "USD" },
    "reviews": [
      {
        "review_id": 786,
        "review_author": "Kristina",
        "review_text": "This is indeed an amazing widget.",
        "published_date": ISODate("2019-02-18")
      }
    ,
      {
        "review_id": 777,
        "review_author": "Pablo",
        "review_text": "Amazing!",
        "published_date": ISODate("2019-02-16")
      }
    ]
  }

  reviewsAll = {
    "review_id": 786,
    "product_id": 1,
    "review_author": "Kristina",
    "review_text": "This is indeed an amazing widget.",
    "published_date": ISODate("2019-02-18")
  },
  {
    "review_id": 785,
    "product_id": 1,
    "review_author": "Trina",
    "review_text": "Nice product. Slow shipping.",
    "published_date": ISODate("2019-02-17")
  }
  ,
  {
    "review_id": 1,
    "product_id": 1,
    "review_author": "Hans",
    "review_text": "Meh, it's okay.",
    "published_date": ISODate("2017-12-06")
  }

// One to Many Document Model with References
// Use referencing to avoid the replication of data
ref = {
    title: "MongoDB: The Definitive Guide",
    author: [ "Kristina Chodorow", "Mike Dirolf" ],
    published_date: ISODate("2010-09-24"),
    pages: 216,
    language: "English",
    publisher: {
               name: "O'Reilly Media",
               founded: 1980,
               location: "CA"
             }
 }
 ref2=  {
    title: "50 Tips and Tricks for MongoDB Developer",
    author: "Kristina Chodorow",
    published_date: ISODate("2011-05-06"),
    pages: 68,
    language: "English",
    publisher: {
               name: "O'Reilly Media",
               founded: 1980,
               location: "CA"
             }
 }

//  storingRefInBooks = {
//     _id: "oreilly",
//     name: "O'Reilly Media",
//     founded: 1980,
//     location: "CA"
//  }
 
//  {
//     _id: 123456789,
//     title: "MongoDB: The Definitive Guide",
//     author: [ "Kristina Chodorow", "Mike Dirolf" ],
//     published_date: ISODate("2010-09-24"),
//     pages: 216,
//     language: "English",
//     publisher_id: "oreilly"
//  }
 
//  {
//     _id: 234567890,
//     title: "50 Tips and Tricks for MongoDB Developer",
//     author: "Kristina Chodorow",
//     published_date: ISODate("2011-05-06"),
//     pages: 68,
//     language: "English",
//     publisher_id: "oreilly"
//  }

// Many to Many Relationships
// Model Tree Structures with Parent References
// References to parent nodes will be stored in the children nodes
db.categories.insertMany( [
    { _id: "MongoDB", parent: "Databases" },
    { _id: "dbm", parent: "Databases" },
    { _id: "Databases", parent: "Programming" },
    { _id: "Languages", parent: "Programming" },
    { _id: "Programming", parent: "Books" },
    { _id: "Books", parent: null }
 ] )

 db.categories.findOne( { _id: "MongoDB" } ).parent

 db.categories.createIndex( { parent: 1 } )

 db.categories.find( { parent: "Databases" } )


//  Model Tree Structures with Child References
db.categories.insertMany( [
    { _id: "MongoDB", children: [] },
    { _id: "dbm", children: [] },
    { _id: "Databases", children: [ "MongoDB", "dbm" ] },
    { _id: "Languages", children: [] },
    { _id: "Programming", children: [ "Databases", "Languages" ] },
    { _id: "Books", children: [ "Programming" ] }
 ] )


 db.categories.findOne( { _id: "Databases" } ).children

 db.categories.createIndex( { children: 1 } )

 db.categories.find( { children: "MongoDB" } )

//  Model Tree Structures with an Array of Ancestors
db.categories.insertMany( [
    { _id: "MongoDB", ancestors: [ "Books", "Programming", "Databases" ], parent: "Databases" },
    { _id: "dbm", ancestors: [ "Books", "Programming", "Databases" ], parent: "Databases" },
    { _id: "Databases", ancestors: [ "Books", "Programming" ], parent: "Programming" },
    { _id: "Languages", ancestors: [ "Books", "Programming" ], parent: "Programming" },
    { _id: "Programming", ancestors: [ "Books" ], parent: "Books" },
    { _id: "Books", ancestors: [ ], parent: null }
  ] )

db.categories.findOne( { _id: "MongoDB" } ).ancestors
db.categories.createIndex( { ancestors: 1 } )
db.categories.find( { ancestors: "Programming" } )

// Model Tree Structures with materialized paths
db.categories.insertMany( [
    { _id: "Books", path: null },
    { _id: "Programming", path: ",Books," },
    { _id: "Databases", path: ",Books,Programming," },
    { _id: "Languages", path: ",Books,Programming," },
    { _id: "MongoDB", path: ",Books,Programming,Databases," },
    { _id: "dbm", path: ",Books,Programming,Databases," }
 ] )

 db.categories.find().sort( { path: 1 } )
 db.categories.find( { path: /,Programming,/ } )
 db.categories.find( { path: /^,Books,/ } )
// You would use this option if you were going to use the materialized path and wanted a guided view

// Many to Many relationships
// Embed the document and make it a one-to-many. The problem here is that you will have duplicated data.
// Reference of arrays in the one many side  : Having a list of them and a reference on the other side


// Schema design patterns
// Modeling data to support keyword search
document = { title : "Moby-Dick" ,
  author : "Herman Melville" ,
  published : 1851 ,
  ISBN : 4051526996 ,
  topics : [ "whaling" , "allegory" , "revenge" , "American" ,
    "novel" , "nautical" , "voyage" , "Cape Cod" ]
}
// Add as many keywords as you want in the topics and then create a multi-key index on that field

db.volumes.createIndex({topics: 1})

db.volumes.findOne({topics: "voyage"}, {title: 1})

// BLOB Data options
// GridFS Storage
// GridFS is used to store and retrieve BLOB data that is larger than 16MB
// mongofiles commandline tool will allow you to use GridFS
// GridFS will store the binary data in chunks store
// GridFS will store the metadata in a files store


// Chunks collection will store like this:
// {
//     "_id" : <ObjectId>,
//     "files_id" : <ObjectId>,
//     "n" : <num>,
//     "data" : <binary>
//   }


// This is the files document that will be in the files collection
// {
//     "_id" : <ObjectId>,
//     "length" : <num>,
//     "chunkSize" : <num>,
//     "uploadDate" : <timestamp>,
//     "md5" : <hash>,
//     "filename" : <string>,
//     "contentType" : <string>,
//     "aliases" : <string array>,
//     "metadata" : <any>,
//   }

// GridFS Indexes 
db.fs.chunks.find( { files_id: myFileID } ).sort( { n: 1 } )

db.fs.files.find( { filename: myFileName } ).sort( { uploadDate: 1 } )

// To actually store a file in GridFS, you will need to use the mongofiles
// To return a list of all files in a GridFS collection in the records database, use the following invocation at the system shell:
// mongofiles -d=records list

// Upload a file to GridFS in the records database
// mongofiles -d=records put 32-corinth.lp

// to delete
// mongofiles -d=records delete 32-corinth.lp

// to search
// mongofiles -d=records search corinth

