// cursor.explain()

db.collection.find().explain()

// the explain verbose parameter
	
// Optional. Specifies the verbosity mode for the explain output. The mode affects the behavior of explain() and determines the amount of information to return. The possible modes are: "queryPlanner", "executionStats", and "allPlansExecution".

// Default mode is "queryPlanner".

// For backwards compatibility with earlier

// queryPlanner mode

// queryPlanner, which details the plan selected by the query optimizer and lists the rejected plans;
// executionStats, which details the execution of the winning plan and the rejected plans;
// serverInfo, which provides information on the MongoDB instance; and
// serverParameters, which details internal parameters.

db.products.find(
    { quantity: { $gt: 50 }, category: "apparel" }
 ).explain("executionStats")

 db.collection.explain().remove(
     {category: "apparel"},
     {justOne: true}
 )

db.collection.explain('queryPlanner')
// The query optimizer is ran and then the selected plan is returned

// Explain and write operations
// The information about the write operation will be returned but the statement will not be executed

// Explain Results
// "winningPlan" : {
//     "stage" : <STAGE1>,
//     ...
//     "inputStage" : {
//        "stage" : <STAGE2>,
//        ...
//        "inputStage" : {
//           "stage" : <STAGE3>,
//           ...
//        }
//     }
//  },

// executionStats
// How many documents were returned by the query
// nReturned

// How many documents were read by the query
// totalDocsExamined

// totalKeysExamined - number of indexes examined


// If the IXSCAN is not a descendant of a FETCH then it means that it is a covered query and totalDocumentsExamined will be 0


// How many documents were returned by the query - nReturned
// How many documents were read by the query - totalDocsExamined
// How many index entries were viewed by the query - totalKeysExamined
// Which index was used by the query - indexName
// When a collection scan occurs - ColScan
// How many index entries were viewed during the query - keysExamined
// Which shards were involved in the query for a sharded collection  -- 
// How to recognize that a query is covered -- if the IXSCAN is not a desendant of a fetch stage
// Whether or not an index was used to sort the query -- SORT stage will be added to executionStats
// How long the query took (or was estimated to take)  --- explain.executionStats.executionStages.executionTimeMillisEstimate
// Which types of queries can use an index (.find(), .update(), .remove()) --- find() and sort() can use the index



// Indexing Strategies
// Remember that each clause of an $or can use a different index if needed


// Create indexes to support your queries
// An index will support a query that contains all of the fields scanned by the query.

// index use and collation
// the collation must be the same for the index to be used

db.myColl.createIndex(
    {category: 1},
    {collation: {locale: "fr"}}
)

db.myColl.find(
    {category: "cafe"},
    {collation: {
        locale: "fr"
    }}
)
// Remember that collation only matters for strings/arrays


// Using indexes to sort query results
// If mongodb cannot use an index it will use a blocking sort
// sort stage will be added to executionStats

// Ensure Indexes Fit in RAM
db.collection.totalIndexSize()
// Returns the number of bytes 
// convert it to GB and make sure it is less than your RAM

// Create queries to ensure selectivity
// Create indexes on larger breadth of value fields


// Index FAQS
// How do write operations affect indexes?¶
// Write operations may require updates to indexes:

// If a write operation modifies an indexed field, MongoDB updates all indexes that have the modified field as a key.
// Therefore, if your application is write-heavy, indexes might affect performance.

// Query Optimization
// More selective queries means that an index will be useful

// Index builds on populated collections
// Foreground index builds allow for faster index building but they lock all read-write access to the parent database
// background index builds allow for the index building to run in the background and read-write accesses can still process.
// Optimized index building only locks the collection for read/write during the index creation.
db.currentOp() //to monitor the current progress of ongoing index builds

// Constraint violations during index build
// For constraint based indexes such as unique indexes, mongodb is going to compare the pre-loaded data and any new data adfter the build
// completes
// If any pre-existing documents violate the constraint unique index after the build, it will throw an error.

// Sharded collections
// Remember that the index may succeed on certain shards and fail on other you will need to do a db.collection.dropIndex()

// Index Build Impact on Database Performance
// Building indexes during heavy write load can result in reduced write performance

// Insufficient Available Memory (RAM)

db.getSiblingDB("products").runCommand(
    {
      createIndexes: "inventory",
      indexes: [
          {
              key: {
                  item: 1,
                  manufacturer: 1,
                  model: 1
              },
              name: "item_manufacturer_model",
              unique: true
          },
          {
              key: {
                  item: 1,
                  supplier: 1,
                  model: 1
              },
              name: "item_supplier_model",
              unique: true
          }
      ],
      writeConcern: { w: "majority" }
    }
  )

// The default memory limit for createIndexes is 200MB

// Index Builds in Replicated Environments
// Indexes build simultaneously on replica sets and sharded collections

// Build Process for indexes in replicated environments:
// The primary receives the createIndexes command and immediately creates a "startIndexBuild" oplog entry associated with the index build.
// The secondaries start the index build after they replicate the "startIndexBuild" oplog entry.
// Each member "votes" to commit the build once it finishes indexing data in the collection.
// Secondary members continue to process any new write operations into the index while waiting for the primary to confirm a quorum of votes.
// When the primary has a quorum of votes, it checks for any key constraint violations such as duplicate key errors.

// If there are no key constraint violations, the primary completes the index build, marks the index as ready for use, and creates an associated "commitIndexBuild" oplog entry.
// If there are any key constraint violations, the index build fails. The primary aborts the index build and creates an associated "abortIndexBuild" oplog entry.
// The secondaries replicate the "commitIndexBuild" oplog entry and complete the index build.

// If the secondaries instead replicate an "abortIndexBuild" oplog entry, they abort the index build and discard the build job.

// Build Failure and Recovery
// Interrupted Build on a primary mongod
// If the primary has a clean shut down, it will recover the index build upon restart else the build must be restarted from the beginning

// Monitor in progess index builds
db.currentOp() // will show you the current operations for the index creation operations


// Terminate in progress index builds
// dropIndexes or dropIndex will terminiate an in-progress index build

// Index Build Process

// Index Key Limitations
// 1024 byte size limit for index keys each index limitation is going away

// Hybrid Index Build
// This feature essentially removes database locks
// Previously we had foreground index builds and background index builds
// Foreground --- locking
db.movies.createIndex({title: 1})

// background index builds -- not building but slower yields to incoming read-write operations 
// Incremental can take lots of time
db.collection.createIndex({title: 1}, {background: true})

// New hybrid index build has the performance of a foreground index and the non locking read-write of a background index
// This is now the only way to build an index
db.movies.createIndex({name: 1})


// Regex on String Fields and Indexes
// $regex

db.products.insertMany([
    { "_id" : 100, "sku" : "abc123", "description" : "Single line description." },
{ "_id" : 101, "sku" : "abc789", "description" : "First line\nSecond line" },
{ "_id" : 102, "sku" : "xyz456", "description" : "Many spaces before     line" },
{ "_id" : 103, "sku" : "xyz789", "description" : "Multiple\nline description" }
])

// SELECT * FROM products
// WHERE sku like "%789";
db.products.find(
    {sku: {
        $regex: /789$/
    }}
)
//  ^ means starting
// $ means ending
// Performing case-insensitive regex matching
// i option is going to allow you to specify caseInsensitive
db.products.find(
    {
        sku : {
            $regex: /^ABC/i
        }
    }
)

// Index use in Regex
// If the regex query is case sensitive it can use the appropriate index
// prefix operations further optimize by allowing the index to be searched by it ^ABC
// ^ \A are both beginning anchors
// /^a/ is the fastest as it is left anchor
