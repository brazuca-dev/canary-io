#!/bin/bash
echo "########### [LocalStack] S3 initialization ###########"

# 1. create a bucket
awslocal s3 mb s3://${S3_BUCKET_NAME}

# 2. Apply CORS using the environment variable
awslocal s3api put-bucket-cors --bucket ${S3_BUCKET_NAME} --cors-configuration "{
  \"CORSRules\": [
    {
      \"AllowedOrigins\": [\"${API_CORS_ORIGIN}\", \"https://app.localstack.cloud\"],
      \"AllowedMethods\": [\"GET\", \"PUT\"],
      \"AllowedHeaders\": [\"*\"],
      \"ExposeHeaders\": [\"ETag\"]
    }
  ]
}"

# 3. Event configuration
awslocal s3api put-bucket-notification-configuration --bucket ${S3_BUCKET_NAME} --notification-configuration "{
  \"LambdaFunctionConfigurations\": [
    {
      \"LambdaFunctionArn\": \"arn:aws:lambda:${AWS_REGION}:123456789012:function:${S3_LAMBDA_FUNCTION}\",
      \"Events\": [\"s3:ObjectCreated:*\"]
    }
  ]
}"

echo "########### [LocalStack] S3 initialization completed ###########"