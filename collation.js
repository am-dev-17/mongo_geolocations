// Collation
// Case insensitive indexes using collation
db.collection.createIndex()
// specify the collation parameter as an option
// db.collection.createIndex( { "key" : 1 },
//                            { collation: {
//                                locale : <locale>,
//                                strength : <strength>
//                              }
//                            } );


// strength 1 and indicates a case insensitive collation

db.createCollection('fruit')
db.fruit.createIndex(
    {type: 1},
    {
        collation: {
            locale: 'en',
            strength: 2
        }
    }
)


db.fruit.insertMany( [
    { type: "apple" },
    { type: "Apple" },
    { type: "APPLE" }
 ] )

 db.fruit.find(
     {type: 'apple'}
 )


//  This will use an index scan
 db.fruit.find(
     {type: 'apple'}
 ).collation(
     {locale: 'en', strength: 2}
 ).explain('executionStats')


//  This will not use an index
 db.fruit.find(
    {type: 'apple'}
).collation(
    {locale: 'en', strength: 1}
).explain('executionStats')

db.createCollection('names',
{
    collation: {
        locale: 'en_US', strength: 2
    }
})


db.names.createIndex(
    {first_name: 1} //will inherit the default collation
)

db.names.insertMany( [
    { first_name: "Betsy" },
    { first_name: "BETSY"},
    { first_name: "betsy"}
 ] )


db.names.find( { first_name: "betsy" } )

//bypass the index and it will default strength 3
db.names.find( { first_name: "betsy" } ).collation( { locale: 'en_US' } )

// Collation Locales And Default Parameters
caseLevel : false
strength : 3
numericOrdering : false
maxVariable : punct

// The numberDecimal type
// NumberDecimal provides exact precision with base 10 floating numbers
// NumberDecimal is less vulnerable to floating rounding errors
// All numbers are treated as double by default
// NumberDecimal() to explicitly define it
NumberDecimal("1000.55")
// Potential loss of precision
NumberDecimal(1000.55)
// This will be the value stored due to loss of precision
NumberDecimal("1000.55000000000")

// NumberDecimal doing Equality and Sort Order
db.numbers.insertMany([{ "_id" : 1, "val" : NumberDecimal( "9.99" ), "description" : "Decimal" },
{ "_id" : 2, "val" : 9.99, "description" : "Double" },
{ "_id" : 3, "val" : 10, "description" : "Double" },
{ "_id" : 4, "val" : NumberLong("10"), "description" : "Long" },
{ "_id" : 5, "val" : NumberDecimal( "10.0" ), "description" : "Decimal" },

])

// { "val": 9.99 }
// { "_id": 2, "val": 9.99, "description": "Double" }
// { "val": NumberDecimal( "9.99" ) }
// { "_id": 1, "val": NumberDecimal( "9.99" ), "description": "Decimal" }
// { val: 10 }
// { "_id": 3, "val": 10, "description": "Double" }
// { "_id": 4, "val": NumberLong(10), "description": "Long" }
// { "_id": 5, "val": NumberDecimal( "10.0" ), "description": "Decimal" }
// { val: NumberDecimal( "10" ) }
// { "_id": 3, "val": 10, "description": "Double" }
// { "_id": 4, "val": NumberLong(10), "description": "Long" }
// { "_id": 5, "val": NumberDecimal( "10.0" ), "description": "Decimal" }

// The first query, { "val": 9.99 }, implicitly searches for the double representation of 9.99 which is not equal to the decimal representation of the value.

// The NumberDecimal() constructor is used to query for the document with the decimal representation of 9.99. Values of the double type are excluded because they do not match the exact value of the decimal representation of 9.99.

db.inventory.find(
    {price: {$type: 'decimal'}}
)

// Model Monetary Data using NumberDecimal()

db.gasprices.insert({ "_id" : 1, "date" : ISODate(), "price" : NumberDecimal("2.099"), "station" : "Quikstop", "grade" : "regular" })
db.gasprices.find( { price: NumberDecimal("2.099") } )
db.numbers.insertMany([
    { "_id" : 1, "description" : "T-Shirt", "size" : "M", "price" : NumberLong("1999") },
    { "_id" : 2, "description" : "Jeans", "size" : "36", "price" : NumberLong("3999") },
    { "_id" : 3, "description" : "Shorts", "size" : "32", "price" : NumberLong("2999") },
    { "_id" : 4, "description" : "Cool T-Shirt", "size" : "L", "price" : NumberLong("2495") },
    { "_id" : 5, "description" : "Designer Jeans", "size" : "30", "price" : NumberLong("8000") }
    
])
