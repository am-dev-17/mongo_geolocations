// Viewws
// A view is a queryable object whose content is defined by an aggregation pipeline from other collections or views.
// the content is created on demand
// write operations are NOT allowed against views.

// db.createCollection(
//     "<viewName>",
//     {
//       "viewOn" : "<source>",
//       "pipeline" : [<pipeline>],
//       "collation" : { <collation> }
//     }
//   )

// db.createView(
//     "<viewName>",
//     "<source>",
//     [<pipeline>],
//     {
//       "collation" : { <collation> }
//     }
//   )

// The view must be in the same database as the source collection
// Remember that views are read-only
// You cannot rename a view
// View Creation
db.createView(
    "justNameAndTeam",
    'employees',
    [
        {
            $project: {
                _id: 0, name: 1, team: 1
            }
        }
    ]
)
// the view will be added to system.views
db.justNameAndTeam.find()