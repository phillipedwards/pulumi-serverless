import * as aws from "@pulumi/aws";
import { ObjectServiceResource } from "./object-service-resource"

// storage bucket for objects
const bucket = new aws.s3.Bucket("ObjectStorage");

// component resource that will wrap lambda and dynamo table
const service = new ObjectServiceResource("ServerLessObjectService", {});

// subscribe to "ObjectCreated" event for lambda to process new item
bucket.onObjectCreated("ObjectHandler", service.writerLambda);

// uploads to bucket will trigger lambda to create item in dynamodb
export const bucketName = bucket.bucket;