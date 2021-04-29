"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB();
const tableName = process.env.TABLE_NAME || "";
exports.handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received request to create s3 objects");
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
        };
        yield dynamo.putItem(params).promise();
        console.log(`Successfully created object ${s3Object.key} record`);
    }
});
