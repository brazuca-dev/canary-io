#!/bin/bash
echo "########### [LocalStack] SQS initialization ###########"

# 1. Create SQS queue
awslocal sqs create-queue --queue-name ${SQS_QUEUE_NAME}

echo "########### [LocalStack] SQS initialization completed ###########"