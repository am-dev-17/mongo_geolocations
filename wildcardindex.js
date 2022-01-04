// Wildcard indexes are for dynamics fields. We can create indexes using fields that are not yet used
db.userMetadata.insertMany([
    { "userMetadata" : { "likes" : [ "dogs", "cats" ] } },
{ "userMetadata" : { "dislikes" : "pickles" } },
{ "userMetadata" : { "age" : 45 } },
{ "userMetadata" : "inactive" }
])

db.userMetadata.createIndex({"userMetadata.$**": 1})

db.userData.find({ "userMetadata.likes" : "dogs" })
db.userData.find({ "userMetadata.dislikes" : "pickles" })
db.userData.find({ "userMetadata.age" : { $gt : 30 } })
db.userData.find({ "userMetadata" : "inactive" })

db.collection.createIndex( { "fieldA.$**" : 1 } )

db.product_catalog.insertMany(
    [
        {
            "product_name" : "Spy Coat",
            "product_attributes" : {
              "material" : [ "Tweed", "Wool", "Leather" ],
              "size" : {
                "length" : 72,
                "units" : "inches"
              }
            }
          }
          ,
          {
            "product_name" : "Spy Pen",
            "product_attributes" : {
               "colors" : [ "Blue", "Black" ],
               "secret_feature" : {
                 "name" : "laser",
                 "power" : "1000",
                 "units" : "watts",
               }
            }
          }
    ]
)

db.product_catalog.createIndex({"product_attributes.$**": 1})

db.product_catalog.find({
    "product_atrributes.size.length": {
        $gt: 60
    }
})

db.collection.createIndex( { "$**" : 1 } )

// creating a wildcard index on multiple specific fields
db.collection.createIndex(
    {"$**": 1},
    {
        "wildcardProjection": { //Will only use these fields to create the wildcard index
            fieldA: 1,
            "fieldB.fieldC": 1
        }
    }
)



db.collection.createIndex(
    { "$**" : 1 },
    { "wildcardProjection" :
      { "fieldA" : 0, "fieldB.fieldC" : 0 }
    }
  )


// Wildcard indexes query and support
// To be considered a covered query, the query must only contain 1 field and the _id must be omitted


// Wildcard indexes querying with sort
// The query planner selects the wildcard index for satisfying the query predicate.
// The sort() specifies only the query predicate field.
// The specified field is never an array.

db.products.createIndex( { "product_attributes.$**" : 1 } )
db.products.find(
    { "product_attributes.price" : { $gt : 10.00 } },
  ).sort(
    { "product_attributes.price" : 1 }
  )
// Because the sort specifies only the query predicate field it will be used for indexing
// REMEMBER WILDCARDS ONLY WORK WITH A SINGLE FIELD FOR COVERED QUERIES AND SORTING even if you use the wildcardProjection operator

// Using indexes to sort query results


db.data.find( { a: 5 } ).sort( { b: 1, c: 1 } )
// { a: 1 , b: 1, c: 1 }
db.data.find( { b: 3, a: 4 } ).sort( { c: 1 } )
// { a: 1, b: 1, c: 1 }
db.data.find( { a: 5, b: { $lt: 3} } ).sort( { b: 1 } )
// { a: 1, b: 1 }
// As the last operation shows, only the index fields preceding
//  the sort subset must have the equality conditions in the query document; the other index fields may specify other conditions.

