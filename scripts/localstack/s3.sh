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

echo "########### [LocalStack] S3 initialization completed ###########"