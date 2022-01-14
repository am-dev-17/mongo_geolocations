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

