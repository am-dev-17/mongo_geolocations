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