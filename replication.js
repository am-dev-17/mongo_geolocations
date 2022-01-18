// replica sets and replication
// A replica set is a group of mongod instances that contain replicas of the same data set
// There is always only one primary node and the rest are secondary nodes
// One primary node is used for writes with {w: "majority"}
// all data operations are recorded in the oplog
// An arbiter is a mongod instance that does not have data and will only participate in voting

// Asynchronous replication
// Remember that secondaries are going to replicate the primary's oplog

// Slow operations
// slow oplog replication options will be recorded in the diagnostic log

// Replication lag and flow control
// Replication lag refers to the amount of time the secondary node takes to copy the primary's oplog
// Admins can limit the rate at which primary applies it's writes so replication lag can be kept under 
// it is enabled by default
// flowControlTargetLagSeconds

// Automatic Failover
// When the primary does not communicate the other members
// of the set for more than the configured electionTimeoutMillis
// 10 seconds by default an election is called and the 
// new primary node is selected.
// modify electionTimeoutMillis for the specified timeout

// Read Operations
// Read Preference
// clients can specify a read preference 
// and send read operations to secondaries
// multi-document transactions must use read preference primary

// Data Visibility
// durable - A write operation 
// write operation is durable when it will persist across
// a shutdown or crash of one or more server prcoesses
// A write is considered durable when it is written to the servers
// journal log
// For replica set, write is considered durabled once the 
// write operation is durable on majority of voting nodes.
// written to voting node's journals

// Write Concern
// Write concern represents the level of ack requested from
// MongoDB to write operations 
// write concern specification
// {w: 5}

// clients using local or available read concern can read
// data before write concern is completed


// Mirrored Reads
// Mirrored Reads reduce
// Mirrored reads pre-warm the caches of the electable
// secondary replica set members
// Mirrors a sample of supported operations it receives
// to electable secondaries
// The size of the subset of electable secondary replica
// set members can be mirrored with the 
// mirroredReads parameter. To control the number
// of electable secondaries

// Enable/Disable support for Mirrored Reads
// Mirrored reads are enabled by default
// mirroredReads: 0.0

db.adminCommand({
    setParameter: 1,
    mirrorReads: {
        samplingRate: 0.0
    }
})

// Mirrored Reads support the following operations
// count
// distinct
// find
// findAndModify
// update

// Mirrored Reads Metrics
db.serverStatus({mirroredReads: 1}) 
// This will allow you to see stats for your mirrored reads


// Transactions
// multi-document transactions are available for replica sets

// Change Streams
// Change Streams allow for a developer first ability
// to track data changes and use them for development

// Additional Features
// 

// Replica Set Data Synchronization
// Initial sync
// Initial sync is going to copy all of the data from one
// member of the replica set to another member. 
// initialSyncSourcePreference -- This is the prefered 
// sync source
// This parameter can only be specified when starting mongod

// Initial Sync Process
// Clones all databases except the local db.
// All indexes are copied over too
// oplog for the recent data is pulled at the end


// Fault Tolerance
// network failure will cause initial sync to restart completely
// Initial sync can restart if small network error, dollection drop
// or collection rename
// Initial sync is tried to be resumed for 24 hours

// Initial sync source selection
// initialSyncReadPreference
// primary will only use the primary node and log an error
// if it is not available
// initialSyncSourceReadPreference set to
// primaryPreferred will try to select the primary
// as the sync source but if it cannot then sync source selection
// will become one of the remaining replica set members
// if a specific read node is specified then it will select it

// Members performing initial sync source selection make two
// passes through the list of all replica set members
// Sync source must be in the primary or secondary replication state
// initialSyncSourcePreference is secondary or secondaryPreferred
// Second pass is a more relaxed criteria


// Replication
// The oplog replication is used for ongoing replication

// Streaming replication
// sync from sources is a continous stream of oplog entries
// into their syncing secondaries


// Multithreaded Replication
// no

// Flow Control
// flowControlTargetLagSeconds
// flowControlTargetLagSeconds 
// is going to allow for you to control writes lags
// to mitigate replication lag

// Replication Sync Source Selection
// Perform sync source selection from replica set members
// This is with chaining.

// WHAT IS CHAINING?
// settings.chainingAllowed
// Secondary members can replicate from other secondary members
// false will not allow this ability
// settings.chainingAllowed is true by default

// MongoDB Replica Sets
// Async replication 
// protocol version 1 -- RAFT protocol 
// pv0 -> some configuration details

// PV1
// oplog will have idemopotent outputs
// have an odd number of nodes
// maximum 7 voting members possible
// secondary nodes can be hidden - Copies from data
// hidden from application and delay from replication process
// allow resilience to application corruption

// Asynchronous replication
// designed for commodity servers and fast
// single primary only
// tag-aware sharding is similar to master master

// Nodes
// Arbiter - The voting only node that will not have any data
// Delayed - Delay the write to primary so that the replication lag can be decreased
// votes - The voting sysem will determine the new primary when the current primary is lost.
// priority

// Replica Set Members
// Primary - The primary will receive all write operations
// Secondary - The secondaries maintain an identical data set using the oplog from the primary or using chaining with another secondary.
// A replica set can have up to 50 members but only 7 voting members

// Primary
// The primary will receive all write operations

// Read Preference
// How clients route read operations to the members of a replica set
// default is that the client will be routed to primary node
// primary
// primaryPreferred
// secondary
// secondaryPreferred
// nearest

// Replica Set Elections
// Replication member priority - The secondaries with the highest priority will become the primary typically
// members with priority 0 will not be able to become primary

// Mirrored reads
// Mirrored reads are used to pre-warm secondary member's caches with the most recently accessed data.

// Voting Members
// members[n].votes = 1 by default and will allow each member to vote
// members[n].votes = 0 will make it so that the member cannot vote

// Non-voting members
// non-voting members must have votes and priority set to 0
// {
//     "_id" : <num>,
//     "host" : <hostname:port>,
//     "arbiterOnly" : false,
//     "buildIndexes" : true,
//     "hidden" : false,
//     "priority" : 0,
//     "tags" : {
 
//     },
//     "secondaryDelaySecs" : NumberLong(0),
//     "votes" : 0
//  }

// Hidden Replica Set Members
// Use hidden for dedicated tasks. This means that you should you use hidden when you want a member to not be accessed by a client

// Delayed Replica Set Members
// A delayed replica set member will have a delay of data available. This is great for a backup or a point in time recovery
// Requirements for delayed replica set members
// must be priority 0
// Must be a hidden member
// Typically want them to be non-voting

// Arbiter
// The Arbiter nodes will not have any data and will only have a single vote

// Delayed Replica Set Members
// {
//     "_id" : <num>,
//     "host" : <hostname:port>,
//     "priority" : 0,
//     "secondaryDelaySecs" : <seconds>,
//     "hidden" : true
//  }

// Hidden Replica Set Members
// These members must have priority 0

// Configuring non-voting replica set member
// rs.reconfig() and set votes to 0 and priority 0
cfg.members[n].votes = 0;
cfg.members[n].priority = 0;

rs.reconfig(cfg);

// Replica Set configuration
// rs.conf()
// rs.reconfig() is going to let us re-configure the replica set

// Replica Set Arbiter

// Initiating a Replica Set
// How to initiate a replica set (or initiate a single server and add replica set members)
// The initial sync of a secondary node in a replica set

// Setting up a replica Set
// mongod -f node1.conf
// replication
//      replicaSetName: hello-rs
// To initiate a replicaSet, you need to run rs.initiate() 
// To add the replica set members you need to specify the replica set name in host
// To add to the replica set, we need to run rs.add("hostname:27017")
// rs.stepDown() is going to make the primary a secondary and force an election
// rs.isMaster() will tell you whether a node is a master and the status of it and give information on the RS

// rs.intiate()
// rs.initiate() will initiate a replica set and begin the replica set process

// rs.initiate() with examples
rs.initiate(
    {
        _id: "myReplSet",
        version: 1,
        members: [
            {_id: 0, host: "mongodb1.example.net:27017"},
            {_id: 1, host: "mongodb2.example.net:27017"},
            {_id: 2, host: "mongodb3.example.net:27017"}
        ]
    }
)
// rs.initiate() IP Binding
// bind to local host by default
// mongod --bind_ip localhost,My-Example-Associated-Hostname
// mongosh --host My-Example-Associated-Hostname

// mongosh --host 198.51.100.1

// Initial Sync
// The initial sync is going to copy all of the data from one member of the replica set to another member.
// InitialSyncSourceReadPreference can control the initial sync

// Replica Set deployment tutoriala
// Use the --bind_ip option to ensure that MongoDB listens for connections from applications on configured addresses.
// mongosh --host My-Example-Associated-Hostname
// mongosh --host 198.51.100.1

// Connectivity
// Ensure that the network traffic can pass securely between all mongod instances
// Set replication.replSetName option to the replica set name. If your application connects to more than one replica set, each set must have a distinct name.
// Set net.bindIp option to the hostname/ip or a comma-delimited list of hostnames/ips.
// mongod --replSet "rs0" --bind_ip localhost,<hostname(s)|ip address(es)>
replication:
   replSetName: "rs0"
net:
   bindIp: localhost,hostname(s)|ip-address

//    mongod --config <path-to-config>

// run mongo shell on one of the instances
// rs.initiate()
// When possible, use a logical DNS hostname instead of an ip address, particularly when configuring replica set members or sharded cluster members. The use of logical DNS hostnames avoids configuration changes due to ip address changes.
rs.initiate( {
    _id : "rs0",
    members: [
       { _id: 0, host: "mongodb0.example.net:27017" },
       { _id: 1, host: "mongodb1.example.net:27017" },
       { _id: 2, host: "mongodb2.example.net:27017" }
    ]
 })

 rs.conf()
//  {
//     "_id" : "rs0",
//     "version" : 1,
//     "protocolVersion" : NumberLong(1),
//     "members" : [
//        {
//           "_id" : 0,
//           "host" : "mongodb0.example.net:27017",
//           "arbiterOnly" : false,
//           "buildIndexes" : true,
//           "hidden" : false,
//           "priority" : 1,
//           "tags" : {
 
//           },
//           "secondaryDelaySecs" : NumberLong(0),
//           "votes" : 1
//        },
//        {
//           "_id" : 1,
//           "host" : "mongodb1.example.net:27017",
//           "arbiterOnly" : false,
//           "buildIndexes" : true,
//           "hidden" : false,
//           "priority" : 1,
//           "tags" : {
 
//           },
//           "secondaryDelaySecs" : NumberLong(0),
//           "votes" : 1
//        },
//        {
//           "_id" : 2,
//           "host" : "mongodb2.example.net:27017",
//           "arbiterOnly" : false,
//           "buildIndexes" : true,
//           "hidden" : false,
//           "priority" : 1,
//           "tags" : {
 
//           },
//           "secondaryDelaySecs" : NumberLong(0),
//           "votes" : 1
//        }
       
//     ],
//     "settings" : {
//        "chainingAllowed" : true,
//        "heartbeatIntervalMillis" : 2000,
//        "heartbeatTimeoutSecs" : 10,
//        "electionTimeoutMillis" : 10000,
//        "catchUpTimeoutMillis" : -1,
//        "getLastErrorModes" : {
 
//        },
//        "getLastErrorDefaults" : {
//           "w" : 1,
//           "wtimeout" : 0
//        },
//        "replicaSetId" : ObjectId("585ab9df685f726db2c6a840")
//     }
//  }

rs.status() // gives you the replica set emember that is primary

// Add an arbiter to a Replica Set
// Do not run an arbiter on systems that also host the primary or the secondary members of the replica set.
// In general, avoid deploying more than one arbiter per replica set.
rs.addArb("m1.example.net:27017") //Connect to the primary and then add the arbiter node


// Convert a standalone to a replica set
// Shutdown the mongod instance and then run
// mongod --port 27017 --dbpath /srv/mongodb/db0 --replSet rs0 --bind_ip localhost,<hostname(s)|ip address(es)>

rs.initiate()

// Adding members to a replica set
// mongod --dbpath /srv/mongodb/db0 --replSet rs0  --bind_ip localhost,<hostname(s)|ip address(es)>
// Connect to the replicasets primary and then run:
rs.add( { host: "mongodb3.example.net:27017" } )

// Remove members from replica set
// shutdown the instance mongod 
db.shutdownServer()
db.hello()
rs.remove()
rs.remove("mongod3.example.net:27017")
rs.remove("mongod3.example.net")

// Removing using rs.reconfig()
rs.reconfig(
    {
        "_id" : "rs",
        "version" : 7,
        "members" : [
            {
                "_id" : 0,
                "host" : "mongod_A.example.net:27017"
            },
            {
                "_id" : 1,
                "host" : "mongod_B.example.net:27017"
            },
            {
                "_id" : 2,
                "host" : "mongod_C.example.net:27017"
            }
        ]
    }
)

// Elections
// Events that can trigger an election
// How priority, votes, optime, and unreachable servers in the affect the outcome of the election
// Which node will win the election

// Failovers and elections
rs.stepDown() // will allow for you to safely perform an election
// Elections
// rs.reconfig() will always result in an election

// priority all being the same?
// The newest copy of the data will get to be primary

// Lets talk about the priority of each node
rs.conf 

// Replica Set Elections
// how can an election take place?
// reconfiguration of the rs
// rs.stepDown()
// initiating a replica set
// adding a new node to the replicaSet
// secondary nodes losing connectivity to the primary node
// The replica set cannot process write operations until the election completes successfully
// Read queries can work if they are read options for secondaries
// Median time for the election process should be less than 12 seconds

// Factors and conditions that affect elections
