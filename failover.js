// What triggers a failover
// That a failover will trigger an election

// automatic failover
// automatic node recovery - Majority consensous that a node must be down
// The drivers will be replica set aware
// 10 seconds for failover

// Replica Set High Availability
// Rollbacks during replica set failover
// If a former primary rejoins the replica set and had data written to it that was not written to the secondary,
// Then a rollback will occur!

// collect rollback data
// createRollBackDataFiles is a parameter to set if you want a rollback data file to be created

// Rollback Data
// By default when a rollback occurs, MongoDB will write the rollback data to BSON files.

// Rollback Data Exclusion
// rollback drop and deletion will not be written to the rollback data directory

// Read Rollback Data
// To read the contents of the rollback files, you need to use bsondump

// Avoid Replica Set Rollbacks
// Rollbacks often occur when writen concern {w:1} is present. This means that the write concern only acks
// for the primary and if data if the primary steps down and the data is still written then a rollback can occur.

// Journaling and Write Concern Majority
// {w: "majority"} will guarantee that write operations propogate to a majority of the replica set nodes

// Visibility of data that can be rolled back
// local and available read concerns can still see the data before the write concern is acknowledged

// Rollback considerations
// all in process user operations will be killed if a member enters the ROLLBACK state

// Index Builds
// Index builds will finish and then the rollback will occur

// Rollback
// Recovery
// Rollback Time limit - 
// Rollback Directory - <dbpath>/rollback/<uuid>/remove.datetime.bson

// rs.status()
// Read and understand the output of the rs.status() command
// know what data is in rs.status()

db.adminCommand( { replSetGetStatus : 1 } )

rs.status()
// This will have all of the details of the members listed 
// if they are having communication issues
// write member vote counts and also writableVotingMembersCount
// which replica set member is a primary
