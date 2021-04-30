# Serverless
A quick example of an AWS serverless application using Pulumi and typescript.

## Description
This Pulumi app will create a simple serverless application in AWS consisting of a S3 bucket, a lambda function, and a dynamodb table. Any object uploaded to the S3 bucket will be automatically processed by the lambda function, and insert the object's metadata into the dynamodb table.

## Usage
Download and install the [Pulumi](https://www.pulumi.com/docs/get-started/)
Clone this repository  
run 'pulumi up'

## License
[MIT](https://choosealicense.com/licenses/mit/)