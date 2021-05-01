import * as pulumi from "@pulumi/pulumi";
import { ManagedPolicy, Policy, Role, RolePolicyAttachment } from "@pulumi/aws/iam";
import { Table } from "@pulumi/aws/dynamodb";
import { Function } from "@pulumi/aws/lambda";

const runtime = "nodejs12.x";
const codePath = "./app";

export class ObjectServiceResource extends pulumi.ComponentResource {
    public readonly writerLambda: Function;

    constructor(name: string, opts: pulumi.ComponentResourceOptions) {
        super("Serverless:ObjectService", name, {}, opts);

        // construct the dynamodb table with primary key, sort key, etc
        const table = this.buildDynamoTable();

        // lambda execution role should have dynamo access, CW access, etc
        const writerRole = this.getLambdaRole(`${name}LambdaRole`, table.arn);

        // build lambda fuc
        this.writerLambda = this.buildLambdaFunction(`${name}Writer`, writerRole, table);
    }

    buildLambdaFunction(name: string, role: Role, table: Table): Function {
        const lambda = new Function(`${name}Function`, {
            role: role.arn,
            code: new pulumi.asset.FileArchive(codePath),
            handler: "index.handler",
            runtime: runtime,
            timeout: 60,
            memorySize: 128,
            environment: {
                variables: {
                    "TABLE_NAME": table.name
                }
            }
        });

        return lambda;
    }

    buildDynamoTable(): Table {
        const table = new Table("Objects", {
            attributes: [
                {
                    name: "ObjectId",
                    type: "S"
                },
                {
                    name: "BucketName",
                    type: "S"
                }
            ],
            hashKey: "ObjectId",
            rangeKey: "BucketName",
            writeCapacity: 20,
            readCapacity: 20
        });

        return table;
    }

    getLambdaRole(name: string, tableArn: pulumi.Output<string>): Role {
        const role = new Role(`${name}Role`, {
            assumeRolePolicy: {
                Version: "2012-10-17",
                Statement: [{
                    Action: "sts:AssumeRole",
                    Principal: {
                        Service: "lambda.amazonaws.com",
                    },
                    Effect: "Allow",
                    Sid: "",
                }]
            }
        });

        // give lambda pemrission to putItem in our table
        const policy = new Policy(`${name}LambdaPolicy`, {
            policy: {
                Version: "2012-10-17",
                Statement: [
                    {
                        Action: [
                            "dynamodb:PutItem"
                        ],
                        Resource: tableArn,
                        Effect: "Allow"
                    }
                ]
            }
        });

        new RolePolicyAttachment(`${name}LambdaRole`, {
            role: role,
            policyArn: policy.arn
        });

        new RolePolicyAttachment(`${name}BasicExecutionRole`, {
            role: role,
            policyArn: ManagedPolicy.AWSLambdaBasicExecutionRole
        });

        new RolePolicyAttachment(`${name}DynamoExecutionRole`, {
            role: role,
            policyArn: ManagedPolicy.AWSLambdaDynamoDBExecutionRole
        });

        return role;
    }
}