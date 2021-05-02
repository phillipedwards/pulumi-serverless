# Serverless
A quick example of how to construct an AWS serverless application using Pulumi and typescript.

## Description
This Pulumi application will create a serverless application in AWS consisting of a S3 bucket, a lambda function, and a dynamodb table. Any object uploaded to the S3 bucket automatically is processed by the lambda function, result in metadata about the object being inserted into dynamodb.

## Requirements
NodeJS > 11.x

## Usage
Download and install the [Pulumi](https://www.pulumi.com/docs/get-started/) cli  
Clone this repository   
Execute 'npm install'  
Execute 'cd app && npm run build && cd ..'  
Execute 'pulumi up'  

## License
[MIT](https://choosealicense.com/licenses/mit/)