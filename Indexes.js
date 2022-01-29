db.collection.createIndex( { name: -1 } )

db.products.createIndex(
    { item: 1, quantity: -1 } ,
    { name: "query for inventory" }
  )

//   
db.records.drop()
db.records.insertOne(
    {
        "_id": ObjectId("570c04a4ad233577f97dc459"),
        "score": 1034,
        "location": { state: "NY", city: "New York" }
      }
)

db.records.createIndex({score: 1})

db.records.find( { score: 2 } )
db.records.find( { score: { $gt: 10 } } )

db.records.createIndex({"location.state": 1})

db.records.find( { "location.state": "CA" } )
db.records.find( { "location.city": "Albany", "location.state": "NY" } )

// Sorting with a single field index
db.records.createIndex( { a: 1 } )
db.records.find().sort({a:1})

db.records.find().sort( { a: -1 } )

db.data.createIndex( { a:1, b: 1, c: 1, d: 1 } )


// { a: 1 }
// { a: 1, b: 1 }
// { a: 1, b: 1, c: 1 }

db.data.find( { a: 5 } ).sort( { b: 1, c: 1 } )
// { a: 1 , b: 1, c: 1 }

db.data.find( { b: 3, a: 4 } ).sort( { c: 1 } )

db.data.find( { a: 5, b: { $lt: 3} } ).sort( { b: 1 } )

db.myColl.createIndex( { category: 1 }, { collation: { locale: "fr" } } )

db.myColl.find( { category: "cafe" } ).collation( { locale: "fr" } )

db.myColl.find( { category: "cafe" } )

// compound indexes
db.products.drop()
db.products.insertMany([
    {
        "_id": 2,
        "item": "Banana",
        "category": ["food", "produce", "grocery"],
        "location": "4th Street Store",
        "stock": 4,
        "type": "cases"
       }
])

db.products.createIndex({item :1, stock: 1})

db.products.find( { item: "Banana" } )
db.products.find( { item: "Banana", stock: { $gt: 5 } } )

// Sort Order
db.events.find().sort( { username: 1, date: -1 } )

// Multikey Indexes
// The idea of a multikey index is to allow us to have an index on an array field and the 
// individual items in the array field will be indexed

// Unique Multikey Index
// For unique indexes, the unique constraint applies across separate documents in the collection rather than within a single document.

db.c.insertOne({ _id: 1, a: [ 1, 2 ], b: [ 1, 2 ], category: "AB - both arrays" })

// Only one field can be an array!

// Query on the array as a whole
db.inventory.insertMany([
    { _id: 5, type: "food", item: "aaa", ratings: [ 5, 8, 9 ] },
{ _id: 6, type: "food", item: "bbb", ratings: [ 5, 9 ] },
{ _id: 7, type: "food", item: "ccc", ratings: [ 9, 5, 8 ] },
{ _id: 8, type: "food", item: "ddd", ratings: [ 9, 5 ] },
{ _id: 9, type: "food", item: "eee", ratings: [ 5, 9, 5 ] }
])

db.inventory.createIndex( { ratings: 1 } )


db.survey.drop()
db.survey.insertOne(
    { _id: 1, item: "ABC", ratings: [ 2, 5, 9 ] }
)

db.survey.createIndex( { ratings: 1 } )
db.inventory.drop()
// Index arrays with embedded documents
db.inventory.insertMany(
    [
        {
            _id: 1,
            item: "abc",
            stock: [
              { size: "S", color: "red", quantity: 25 },
              { size: "S", color: "blue", quantity: 10 },
              { size: "M", color: "blue", quantity: 50 }
            ]
          },
          {
            _id: 2,
            item: "def",
            stock: [
              { size: "S", color: "blue", quantity: 20 },
              { size: "M", color: "blue", quantity: 5 },
              { size: "M", color: "black", quantity: 10 },
              { size: "L", color: "red", quantity: 2 }
            ]
          },
          {
            _id: 3,
            item: "ijk",
            stock: [
              { size: "M", color: "blue", quantity: 15 },
              { size: "L", color: "blue", quantity: 100 },
              { size: "L", color: "red", quantity: 25 }
            ]
          }
          
          
    ]
)

db.inventory.createIndex( { "stock.size": 1, "stock.quantity": 1 } )
db.inventory.find( { "stock.size": "M" } )
db.inventory.find( { "stock.size": "S", "stock.quantity": { $gt: 20 } } )

db.inventory.find( ).sort( { "stock.size": 1, "stock.quantity": 1 } )
db.inventory.find( { "stock.size": "M" } ).sort( { "stock.quantity": 1 } )

// Geospatial Indexes
// 2d indexes and 2dsphere indexes
// db.collection.createIndex( { <location field> : "2dsphere" } )

db.places.insertMany( [
    {
       loc : { type: "Point", coordinates: [ -73.97, 40.77 ] },
       name: "Central Park",
       category : "Parks"
    },
    {
       loc : { type: "Point", coordinates: [ -73.88, 40.78 ] },
       name: "La Guardia Airport",
       category : "Airport"
    }
 ] )

 db.places.createIndex( { loc : "2dsphere" } )

 db.places.createIndex( { loc : "2dsphere" , category : -1, name: 1 } )

//  2d indexes

// Text indexes
// A collection can only have one text search index, but that index can cover multiple fields.

db.reviews.createIndex({
    comments: "text"
})

db.reviews.createIndex(
    {
      subject: "text",
      comments: "text"
    }
  )


//   
// creates an index on every single field in the document that has a string
db.collection.createIndex( { "$**": "text" } )

db.collection.createIndex( { a: 1, "$**": "text" } )

// Hashed Indexes
db.collection.createIndex( { _id: "hashed" } )

db.collection.createIndex( { "fieldA" : 1, "fieldB" : "hashed", "fieldC" : -1 } )

// Hashed Sharding
// Shard with a hash key because it will allow for cardinality
// even chunks

// Unique Indexes
// db.collection.createIndex( <key and index type specification>, { unique: true } )

db.members.createIndex( { "user_id": 1 }, { unique: true } )

db.members.createIndex( { groupNumber: 1, lastname: 1, firstname: 1 }, { unique: true } )

// { _id: 1, a: [ { loc: "A", qty: 5 }, { qty: 10 } ] }

db.collection.createIndex( { "a.loc": 1, "a.qty": 1 }, { unique: true } )

// Unique Index and Missing Field
// Only one unique null

// Unique Partial Index
// Partial indexes only index the documents in a collection that meet a specified filter expression. If you specify both the partialFilterExpression and a unique constraint, the unique constraint only applies to the documents that meet the filter expression.


// You cannot specify a unique constraint on a hashed index.
// When the query criteria and the projection of a query include only the indexed fields, MongoDB returns results directly from the index without scanning any documents or bringing documents into memory. These covered queries can be very efficient.

// Index Intersection
{ qty: 1 }
{ item: 1 }

db.orders.find( { item: "abc123", qty: { $gt: 15 } } )

db.orders.find( { item: "abc123", qty: { $gt: 15 } } ).explain()

// To determine if MongoDB used index intersection, run explain(); the results of explain() will include either an AND_SORTED stage or an AND_HASH stage.


{ qty: 1 }
// { status: 1, ord_date: -1 }

db.orders.find( { qty: { $gt: 10 } , status: "A" } )

// CreateIndex
// getIndexes

// Returns an array that will hold all indexes for that collection


db.collection.getIndexes()

db.collection.dropIndex()

db.pets.dropIndex( "catIdx" )

db.collection.dropIndexes()

db.collection.dropIndexes( { a: 1, b: 1 } )
db.collection.dropIndexes( "a_1_b_1" )

db.collection.dropIndexes( [ "a_1_b_1", "a_1", "a_1__id_-1" ] )


// Collection Scans
// Know that collection scans are not desired as they scan the entire collection for the appropriate documents and do not use indexes

// Geospatial Indexes and queries
// To specify GeoJSON data use an embedded document with
// type, coordinates

example.geojson(
    {
        location :{
            type: "Point",
            coordinates: [-73.856077, 40.848447]
        }
    }
)

db.collection.createIndex( {"loc" : "2dsphere" } )

// db.collection.createIndex( { <location field> : "2d" } )

// Geospatial indexes CANNOT cover a query!

// Geospatial Query Operators
// $geoIntersects -> Checks to see if the query intersects any of the GeoJSON indexed field
// $geoWithin -> Checks to see if the geoJSON in the query is within a geoJSON field
// $near -> Returns objects in proximity to a point.


db.places.insertMany( [
    {
       name: "Central Park",
       location: { type: "Point", coordinates: [ -73.97, 40.77 ] },
       category: "Parks"
    },
    {
       name: "Sara D. Roosevelt Park",
       location: { type: "Point", coordinates: [ -73.9928, 40.7193 ] },
       category: "Parks"
    },
    {
       name: "Polo Grounds",
       location: { type: "Point", coordinates: [ -73.9375, 40.8303 ] },
       category: "Stadiums"
    }
 ] )

 db.places.createIndex({
     location: "2dsphere"
 })


 db.places.find(
    {
      location:
        { $near:
           {
             $geometry: { type: "Point",  coordinates: [ -73.9667, 40.78 ] },
             $minDistance: 1000,
             $maxDistance: 5000
           }
        }
    }
 )
//  
// geoNear to return documents


db.places.aggregate( [
    {
       $geoNear: {
          near: { type: "Point", coordinates: [ -73.9667, 40.78 ] },
          spherical: true,
          query: { category: "Parks" },
          distanceField: "calcDistance"
       }
    }
 ] )

// GeoJson Objects
// The different types of GeoJSON objects
// Point
point({type: "Point", coordinates: [40,5]})

LineString({type: "LineString", coordinates: [
    [40,5], [41,6]
]})

Polygon({
    type: "Polygon",
    coordinates: [ [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0  ] ] ]
  }
)
innerRing(
{
    type : "Polygon",
    coordinates : [
       [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0 ] ],
       [ [ 2 , 2 ] , [ 3 , 3 ] , [ 4 , 2 ] , [ 2 , 2 ] ]
    ]
  }
)

// MultiPoint
MultiPoint(
    {
        type: "MultiPoint",
        coordinates: [
           [ -73.9580, 40.8003 ],
           [ -73.9498, 40.7968 ],
           [ -73.9737, 40.7648 ],
           [ -73.9814, 40.7681 ]
        ]
      }
)

// 2d indexes
// Intended for legacy coordinate pairs used in mongodb2.2 and eariler

// db.<collection>.createIndex( {<location field> : "<index type>"} ,
                            //  { bits : <bit precision> } )

// 
// Query a 2d index
// db.<collection>.find( { <location field> :
    // { $geoWithin :
    //    { $box|$polygon|$center : <coordinates>
 {/* } } } ) */}

 db.places.find( { loc :
    { $geoWithin :
       { $box : [ [ 0 , 0 ] ,
                  [ 100 , 100 ] ]
   } } } )

   db.places.find( { loc: { $geoWithin :
    { $center : [ [-74, 40.74 ] , 10 ]
} } } )

// db.<collection>.find( { loc: [ <x> , <y> ] } )

db.places.insertMany( [
    {
       loc : { type: "Point", coordinates: [ -73.97, 40.77 ] },
       name: "Central Park",
       category : "Parks"
    },
    {
       loc : { type: "Point", coordinates: [ -73.88, 40.78 ] },
       name: "La Guardia Airport",
       category : "Airport"
    }
 ] )

 db.places.createIndex(
     {loc: "2dsphere"}
 )

 db.places.createIndex( { loc : "2dsphere" , category : -1, name: 1 } )

 db.places.createIndex( { category : 1 , loc : "2dsphere" } )

//  Querying a 2dsphere index

db.places.find( { loc :
    { $geoWithin :
      { $geometry :
        { type : "Polygon" ,
          coordinates : [ [
                            [ 0 , 0 ] ,
                            [ 3 , 6 ] ,
                            [ 6 , 1 ] ,
                            [ 0 , 0 ]
                          ] ]
  } } } } )

//   $geoIntersects
db.places.find( { loc :
    { $geoIntersects :
      { $geometry :
        { type : "Polygon" ,
          coordinates: [ [
                           [ 0 , 0 ] ,
                           [ 3 , 6 ] ,
                           [ 6 , 1 ] ,
                           [ 0 , 0 ]
                         ] ]
  } } } } )

//   Proximity to a GeoJSON Point
// $near is going to allow you to specify the near and get points near it 


// Points within a circle defined in a sphere
db.places.find( { loc :
    { $geoWithin :
      { $centerSphere :
         [ [ -88 , 30 ] , 10 / 3963.2 ]
  } } } )

//   Calculate distance using spherical geometry
db.places.find( { loc :
    { $geoWithin :
      { $centerSphere :
         [ [ -88 , 30 ] , 10 / 3963.2 ]
  } } } )

//   Text Indexes
// How to build a text index
// How to use a text index in a query
// How to sort results by text score

db.reviews.createIndex( { comments: "text" } )

db.reviews.createIndex(
    {
      subject: "text",
      comments: "text"
    }
  )


// 
db.collection.createIndex(
    {
      content: "text",
      "users.comments": "text",
      "users.profiles": "text"
    },
    {
      name: "MyTextIndex"
    }
 )

 db.collection.dropIndex("MyTextIndex")

//  Text Indexes Specify weights
// Include weights option in createIndex option

// Wildcard Text Indexes
db.collections.createIndex(
    {"$**": "text"}
)

// Querying a $text index

db.articles.createIndex( { subject: "text" } )

db.articles.insertMany( [
    { _id: 1, subject: "coffee", author: "xyz", views: 50 },
    { _id: 2, subject: "Coffee Shopping", author: "efg", views: 5 },
    { _id: 3, subject: "Baking a cake", author: "abc", views: 90  },
    { _id: 4, subject: "baking", author: "xyz", views: 100 },
    { _id: 5, subject: "Café Con Leche", author: "abc", views: 200 },
    { _id: 6, subject: "Сырники", author: "jkl", views: 80 },
    { _id: 7, subject: "coffee and cream", author: "efg", views: 10 },
    { _id: 8, subject: "Cafe con Leche", author: "xyz", views: 10 }
] )

// Searching for a single word
db.articles.find(
    {
        $text: {
            $search: "coffee"
        }
    }
)

// Match any of the search terms
db.articles.find( { $text: { $search: "bake coffee cake" } } )
// { "_id" : 2, "subject" : "Coffee Shopping", "author" : "efg", "views" : 5 }
// { "_id" : 7, "subject" : "coffee and cream", "author" : "efg", "views" : 10 }
// { "_id" : 1, "subject" : "coffee", "author" : "xyz", "views" : 50 }
// { "_id" : 3, "subject" : "Baking a cake", "author" : "abc", "views" : 90 }
// { "_id" : 4, "subject" : "baking", "author" : "xyz", "views" : 100 }

db.articles.find( { $text: { $search: "\"coffee shop\"" } } )


// exclude shop
db.articles.find( { $text: { $search: "coffee -shop" } } )

db.articles.find(
    { $text: { $search: "LECHE", $language: "es" } }
 )

//  Case and diatcritic insensitive search
db.articles.find( { $text: { $search: "сы́рники CAFÉS" } } )

db.articles.find( { $text: { $search: "Coffee", $caseSensitive: true } } )

db.articles.find( { $text: { $search: "CAFÉ", $diacriticSensitive: true } } )

// Text Search Score Examples
db.articles.find(
    { $text: { $search: "cake" } },
    { score: { $meta: "textScore" } }
 ).pretty()

 db.articles.find(
    { $text: { $search: "cake" } },
    { score: { $meta: "textScore" } }
 ).sort(
     {
         score: {
             $meta: "textScore"
         }
     }
 ).pretty()

//  /
db.reviews.createIndex( { comments: "text" } )

// Specify weights in a text index


// Hashed Indexes
// How to created a hashed index
// How to create a compound hashed index

// Hashed indexes use a hashing function to compute the hash of the value of the index field. [1] The hashing function collapses embedded documents and computes the hash for the entire value but does not support multi-key (i.e. arrays) indexes. Specifically, creating a hashed index on a field that contains an array or attempting to insert an array into a hashed indexed field returns an error.

// MongoDB automatically computes the hashes when resolving queries using hashed indexes. Applications do not need to compute hashes.


db.collection.createIndex( { _id: "hashed" } )

db.collection.createIndex( { "fieldA" : 1, "fieldB" : "hashed", "fieldC" : -1 } )

// Hashed indexes on embedded documents
// The hashing function will collapse all embedded documents and then create the hash for the entire value

// Wildcard Indexes
// MongoDB 4.2 introduces wildcard indexes for supporting queries against unknown or arbitrary fields.
ex(
{ "userMetadata" : { "likes" : [ "dogs", "cats" ] } },
{ "userMetadata" : { "dislikes" : "pickles" } },
{ "userMetadata" : { "age" : 45 } },
{ "userMetadata" : "inactive" },
)

// Administrators want to create indexes to support queries on any subfield of userMetadata.

db.userData.createIndex({
    "userMetadata.$**": 1
})

db.userData.find({ "userMetadata.likes" : "dogs" })
db.userData.find({ "userMetadata.dislikes" : "pickles" })
db.userData.find({ "userMetadata.age" : { $gt : 30 } })
db.userData.find({ "userMetadata" : "inactive" })

db.collection.createIndex( { "fieldA.$**" : 1 } )

db.collection.createIndex( { "$**" : 1 } )

// Wildcard index query/sort support
db.products.createIndex( { "$**" : 1 } )

db.products.find(
    { "lastName" : "Doe" },
    { "_id" : 0, "lastName" : 1 }
  )

//   The query planner selects the wildcard index for satisfying the query predicate.
// The query predicate specifies exactly one field covered by the wildcard index.

// Multi-Field Query Predicates with Wildcard Indexes

// Sorting with Indexes
// Using Indexes to Sort Query Results

// The explain() method
db.collection.explain()

// How to explain a cursor with cursor.explain()
// Three verbosity settings for explain (queryPlanner, executionStats, all)

// queryPlanner is going to give us back the queryPlan and run the query optimizer to choose the winning plan for the operation under evaluation. cursor.explain() will return the queryPlanner information for the evaluated method

// executionStats Mode -> will give you the executionStats for the execution such as how the query was run,.etc.
// allPlansExecution Mode
// MongoDB runs the query optimizer to choose the winning plan and executes the winning plan to completion. In "allPlansExecution" mode, MongoDB returns statistics describing the execution of the winning plan as well as statistics for the other candidate plans captured during plan selection.
// executionStats does not provide query execution information for the rejected plans.

db.products.find(
    { quantity: { $gt: 50 }, category: "apparel" }
 ).explain("executionStats")

 db.products.explain().remove( { category: "apparel" }, { justOne: true } )


// "winningPlan" : {
//    "stage" : <STAGE1>,
//    ...
//    "inputStage" : {
//       "stage" : <STAGE2>,
//       ...
//       "inputStage" : {
//          "stage" : <STAGE3>,
//          ...
//       }
//    }
// },




// Stages are descriptive of the operation; e.g.

// COLLSCAN for a collection scan
// IXSCAN for scanning index keys
// FETCH for retrieving documents
// SHARD_MERGE for merging results from shards
// SHARDING_FILTER for filtering out orphan documents from shards

// How to read each type of explain plan to determine things such as:
// How many documents were returned by the query -> nReturned
// How many documents were read by the query -> totalDocsExamined
// How many index entries were viewed by the query -> totalKeysExamined
// Which index was used by the query -> IDX_SCAN and then indexName
// When a collection scan occurs -> Winning Plan Stage ->FETCH and then then COLLSCAN stage
// How many index entries were viewed during the query
// Which shards were involved in the query for a sharded collection -> under shards and the shardName will be listed
// How to recognize that a query is covered -> 
// Whether or not an index was used to sort the query
// How long the query took (or was estimated to take)
// Which types of queries can use an index (.find(), .update(), .remove())

// How is an index chosen when there are more than one index
