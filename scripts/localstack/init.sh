#!/bin/bash

# Variáveis para facilitar a manutenção
QUEUE_NAME=${SQS_QUEUE_NAME}
BUCKET_NAME=${S3_BUCKET_NAME}
AWS_REGION=${AWS_REGION}
ACCOUNT_ID=${ACCOUNT_ID}
QUEUE_ARN="arn:aws:sqs:${AWS_REGION}:${ACCOUNT_ID}:${QUEUE_NAME}"

echo "Iniciando configuração de infraestrutura local..."

# 1. Criar a fila SQS
echo "Criando fila SQS: ${QUEUE_NAME}"
awslocal sqs create-queue --queue-name ${QUEUE_NAME} --region ${AWS_REGION}

# 2. Criar o bucket S3
echo "Criando bucket S3: ${BUCKET_NAME}"
awslocal s3 mb s3://${BUCKET_NAME}

# 3. Aplicar a política de CORS no S3
echo "[S3] Aplicando política de CORS..."
CORS_CONFIG=$(cat <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ${LOCALSTACK_CORS_ORIGIN},
      "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
EOF
)

awslocal s3api put-bucket-cors \
    --bucket ${BUCKET_NAME} \
    --cors-configuration "${CORS_CONFIG}"

# 4. Aplicar a política de acesso à fila (Permitir que o S3 envie mensagens)
echo "Configurando permissões da fila SQS..."
cat <<EOF > /tmp/queue_policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "sqs:SendMessage",
      "Resource": "${QUEUE_ARN}",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:s3:::${BUCKET_NAME}"
        }
      }
    }
  ]
}
EOF

STR_POLICY=$(cat /tmp/queue_policy.json | tr -d '\n' | sed 's/"/\\"/g')

awslocal sqs set-queue-attributes \
    --queue-url "http://sqs.${AWS_REGION}.localhost.localstack.cloud:4566/${ACCOUNT_ID}/${QUEUE_NAME}" \
    --attributes "{\"Policy\":\"$STR_POLICY\"}"

# 5. Configurar a notificação de evento no S3
echo "Vinculando eventos de PUT do S3 à fila SQS..."
NOTIFICATION_JSON=$(cat <<EOF
{
  "QueueConfigurations": [
    {
      "QueueArn": "${QUEUE_ARN}",
      "Events": ["s3:ObjectCreated:*"]
    }
  ]
}
EOF
)

awslocal s3api put-bucket-notification-configuration \
    --bucket ${BUCKET_NAME} \
    --notification-configuration "${NOTIFICATION_JSON}"

echo "Configuração concluída com sucesso!"
