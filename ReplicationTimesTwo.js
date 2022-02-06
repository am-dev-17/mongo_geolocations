// The replica set primary is going to be the node that will be written to and acknowledges the writes.
// All write operations are written to the primary's oplog and then the oplog will be used to replicate the data async to the 
// secondary nodes

// Now lets talk about read preferences
// primary, primaryPreferred, secondary,secondaryPreferrred

// Replica Set Secondaries
// If priority is set to 0 then the replica set secondary cannot ever become a primary

// The Arbiter node
// The Arbiter node is a voting node only and will not store any data

// The Replica Set Oplog -> The replica set oplog is a capped collection which will keep a rolling record of all operations
// can grow past it's initial size

// Replica Set synchronization
// The initial sync is going to be able to be determined and we can pick a multitude of different mongod replica set members
// Clones all databases except the local database. To clone, the mongod scans every collection in each source database and inserts all data into its own copies of these collections.
// Applies all changes to the data set. Using the oplog from the source, the mongod updates its data set to reflect the current state of the replica set.
// When the initial sync finishes, the member transitions from STARTUP2 to SECONDARY.

// Fault Tolerance
// If a secondary performing initial sync encounters a non-transient (i.e. persistent) network error during the sync process, the secondary restarts the initial sync process from the beginning.
// ult, the secondary tries to resume initial sync for 24 hours. MongoDB 4.4 adds the initialSyncTransientErrorRetryPeriodSeconds server parameter for controlling the amount of time the secondary attempts to resume initial syn

// Replication Lag and Flow Control
// The replication lag refers to the time it takes for a secondary node to copy the oplog data from the primary
// The goal will be to keep the majority commited writes underneath the configurable value for flowControlTargetLagSeconds
// By default this is enabled

// Lets check the replication lag now
// 
// Check the replication lag
// 
// source: m1.example.net:27017
//     syncedTo: Thu Apr 10 2014 10:27:47 GMT-0400 (EDT)
//     0 secs (0 hrs) behind the primary
// source: m2.example.net:27017
//     syncedTo: Thu Apr 10 2014 10:27:47 GMT-0400 (EDT)
    // 0 secs (0 hrs) behind the primary

// Flow Control
// Automatic Failover
// Retryable Writes
// Retryable writes allow mongodb to retry certain write operations a single time if they encounter network errors.
// or they cannot find a healthy primary in the replica sets or the sharded cluster

// Rollbacks during Replica Set failover
// Read Preferences

// 
// durable
// A write operation is durable when it will persist across a shutdown (or crash) and restart of one or more server processes. For a single mongod server, a write operation is considered durable when it has been written to the server's journal file. For a replica set, a write operation is considered durable once the write operation is durable on a majority of voting nodes; i.e. written to a majority of voting nodes' journals.

// Write Concern
// { w: <value>, j: <boolean>, wtimeout: <number> }
