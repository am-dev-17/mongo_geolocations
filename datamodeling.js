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
