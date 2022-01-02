db.movies.insertMany(
    [
        { title: "Ghostbusters" },
        { title: "E.T." },
        { title: "Blade Runner" }
    ]
);


db.movies.insertMany(
    [
        { _id: 4, title: '300' },
        { _id: 7, title: 'Scarface' }
    ], { 'ordered': false }
)

db.movies.deleteOne(
    { _id: 4 }
)


db.movies.find()

db.movies.deleteOne(
    { "_id": 0 }
)


db.movies.deleteMany(
    { year: 1984 }
)

// This will delete all documents in the collection
db.movies.deleteMany({})

// always faster to drop it using 
db.movies.drop()


db.websites.insertMany([
    { url: 'www.example.com', pageviews: 52 }
])


db.websites.updateOne({"url" : "www.example.com"}, {"$inc" : { "pageviews": 1}})

db.websites.updateOne({"url" : "www.example.com"}, {"$inc" : {"pageviews" : 1}})


db.users.insertMany([
    {name: 'Joe', age: 30, sex: 'male', location: 'Wisconsin'}
])

db.users.updateOne({_id: ObjectId("61aa6b9d5fc94e5e88f837e1")}  , {$set: {"favorite book": "War and Peace"}})

db.users.updateOne({name: 'Joe'}, {$set: {"favorite book": "Ender's Game"}})

db.users.updateOne({name: 'Joe'}, {$set: {"favorite book": ["Ender's Game", "Harry Potter"]}})

db.users.updateOne({name: "Joe"}, {$unset: {"favorite book": 1}})

db.users.posts.insertOne(
    {
        title: 'A Blog Post',
        content: '........',
        author: {
            name: "Joe",
            email: 'joe@example.com'
        }
    }
)

db.users.posts.updateOne(
    {
        title: 'A Blog Post'
    },
    {
        $set : {
            "author.name" : 'Joe Schmo'
        }
    }
)


db.games.insertOne({
    'game': 'pinballl',
    'user': 'joe'
})


db.games.updateOne({'user': "joe"}, {$inc : {'score': 50}})

db.blogs.posts.insertOne({
    title: 'A blog post',
    content: '....'
})

db.blogs.posts.updateOne(
    {title: 'A blog post'}, 
    {$push : {'comments': {
        'name': 'joe', 
        email: 'joe@example.com',
        content: 'nice post.'
    }
}
}
)


db.blogs.posts.updateOne(
    {title: 'A blog post'},
    {
        $push: {
            comments: {
                name: 'Bobby',
                email: 'bob@example.com',
                content: 'cool post'
            }
        }
    }
)


db.stock.ticker.insertOne(
    {
        _id: 'GOOG'
    }
)

db.stock.ticker.updateOne(
    {_id: 'GOOG'},
    {$push : {
        hourly : {
            $each : [563.224, 443.532, 559.123]
        }
    }}
    )

db.movies.insertOne({
    genre: 'horror',
    top10: ['Ghost Rider']
})

db.movies.updateOne(
    {genre: 'horror'},
    {$push : {
        top10: {
            $each: 
                [
                    {name: 'A Nightmare ddffeorrrn Elm', rating: 9.5},
                    {name: 'Saw', rating: 1.5}
                ], 
            $slice: -10,
            $sort: {rating: -1}
        }
    }}
)

db.papers.insertOne({
    'authors cited' : [

    ]
})

// This is how to do a set 
db.papers.updateOne(
    {'authors cited': {$ne : 'Richie'}},
    {$push : {'authors cited': 'Richie'}}
)

// Removing elements
// $pop can be used to remove elements from beginning or end
// $pull can be used to remove elements matching criteria

db.lists.insertOne(
    {todo: ['dishes', 'laundry', 'dry cleaning']}
)

db.lists.updateOne({}, {
    $pull : {
        todo: 'laundry'
    }
})

// Positional array modifications
db.blog.posts.insertOne(
    {
        post: 1,
        content: '....',
        comments: [
            {
                'comment': 'good post',
                'author': 'John',
                votes: 0
            },
            {
                comment: 'I thought it was short',
                author: 'Claire',
                votes: 3
            },
            {
                comment: 'vacation getaways',
                author: 'Lynn',
                votes: -7
            }
        ]
    }
)


// So how do we access the votes?

db.blog.posts.updateOne({'post': 1},
{ $inc : {
    'comments.0.votes': 1
}
})

db.blog.posts.findOne({
    'comments.0.votes': 1
})

// mongoDB positional operator
// This example shows that we can update by a query select
// Then use an operator to update it 
// ONLY UPDATES ONE
db.blog.posts.updateOne(
    {'comments.author': 'John'},
    {
        $set : {
            'comments.$.author': 'Jim'
        }
    }
    )


// updating multiple elements in the array
db.blog.posts.updateOne({
    "_id" : ObjectId("61ad00015fc94e5e88f837ea")
},
{
    $set : {
        'comments.$[elem].hidden': true
    }
},
{
    arrayFilters: [{'elem.votes': { $lte: 3 }}]
})

// Upserts
// upsert is the third parameter of updateOne and updateMany
db.analytics.updateOne(
    {url: '/blog'},
    {
        $inc: {
            'pageviews': 1
        }
    },
    {upsert: true}
)

db.users.updateOne({rep: 25}, 
    {
        $inc: {rep: 3}
    }, {upsert: true})


// $setOnInsert 
// sets a value during the time the document is being inserted
db.users.updateOne({},
    {
        $setOnInsert: {
            createdAt: new Date()
        }
    },
    {upsert: true}
)

// Save shell helper
// save acts as an upsert


// Updating multiple documents
// UpdateMany is going to update all matching documents

db.users.insertMany([
    {birthday: '10/13/1978'},
    {birthday: '10/13/1978'},
    {birthday: '10/13/1978'},
    {birthday: '10/14/1956'}
])

db.users.updateMany({
    birthday: '10/13/1978'
},
{
    $set: {
        gift: 'Happy Birthday'
    }
})

// Returing updated documents
// findOneAndDelete , findOneAndReplace, findOneAndUpdate
// These methods allow you to get the values of the modified
// documents

db.priority.insertMany([
    {status: 'READY', priority: 2},
    {status: 'RUNNING', priority: 4},
    {status: 'RUNNING', priority: 12},
    {status: 'READY', priority: 1}
])

db.priority.findOneAndUpdate(
    {status: 'READY'},
    {$set: {status: 'RUNNING'}},
    {$sort: {priority: -1}}
)

// Sun Dec 05 2021 14:16:31 GMT-0500 (Eastern Standard Time)> db.priority.findOneAndUpdate(
//     ...     {status: 'READY'},
//     ...     {$set: {status: 'RUNNING'}},
//     ...     {$sort: {priority: -1}}
//     ... )
//     {
//             "_id" : ObjectId("61ad100f5fc94e5e88f837ef"),
//             "status" : "READY",
//             "priority" : 2
//     }

// What if I want to return the new document?

db.priority.findOneAndUpdate(
    {status: "READY"},
    {
        $set: {
            status: 'RUNNING'
        }
    },
    {
        $sort: {priority: -1},
        returnNewDocument: true
    }
)


// Querying
// db.coll.find()

db.users.find({username: 'joe', age: 27})

// Specifying which keys to return
db.users.find({}, {username: 1, email: 1})



db.contacts.insertMany([
    {username: 'Joe', email: 'joe@exmaple.com', phone:'33323332'},
    {username: 'Apple', email: 'joe@exmaple.com', phone:'33323332'},
])

// Set one if you want to return the key
db.contacts.find({}, {username: 1, email: 1})

// Limitations


