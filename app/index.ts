import * as AWS from "aws-sdk";
import { S3Event } from "aws-lambda";

const dynamo = new AWS.DynamoDB();

const tableName = process.env.TABLE_NAME || "";

export const handler = async (event: S3Event) => {

    console.log("Received request to create s3 objects");

    // require the table name from environment variables
    if (tableName === "") {
        throw new Error("Table Name must be populated");
    }

    console.log(`Attempting to create ${event.Records.length} records`);

    for (const record of event.Records) {

        const s3Object = record.s3.object;
        console.log(`Creating object by key ${s3Object.key}`);

        const params = {
            TableName: tableName,
            Item: {
                ObjectId: { S: s3Object.key },
                CreatedOn: { S: new Date().toISOString() },
                Size: { N: s3Object.size.toString() },
                BucketName: { S: record.s3.bucket.name }
            }
        }

        await dynamo.putItem(params).promise();

        console.log(`Successfully created object ${s3Object.key} record`);
    }
}