df.write.format('parquet') \
    .mode('overwrite') \
    .save('/tmp/file_csv.csv')

# The different write modes
# append, overwrite, ignore, error/errorifexists
# append will append to the file
# overwrite will overwrite
# ignore will write if there is no file if not silently ignore
# error/errorifexists will throw an error if there is already data present

df.write.format('csv') \
    .option('compression','bzip2') \
    .option('mode', 'error') \
    .save('/hello/hello.csv')

# jdbc
df.write.jdbc(url = 'url')
df.write \
 .jdbc(url=url, table="baz", mode=mode, properties=properties)

# partitionBy
# will partition the given columns on the file system

# saveAsTable
# saves the content of the DF to the specified table

# sortBy
# will sort the output in each bucket by the column
# allows you to use the bucketBy and then specify columns
# and also the number of buckets *cols format similar to repartition

# Remember that a slot can span multiple cores!


