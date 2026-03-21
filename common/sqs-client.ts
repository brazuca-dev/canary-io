import { SQSClient } from "@aws-sdk/client-sqs";

interface SqsMessage {
  header: {
      "message_id": "550e8400-e29b-41d4-a716-446655440000",
      "correlation_id": "ORD-98765", 
      "timestamp": "2026-03-05T15:08:19Z",
      "source": "payment-worker-v1",
      "retry_count": 0
    },
    payload: {
      "order_id": "98765",
      "status": "payment_confirmed",
      "storage_path": "s3://bucket-notas/nota-fiscal-98765.pdf",
      "items": [
        {"sku": "LAP-001", "quantity": 1},
        {"sku": "MOU-005", "quantity": 2}
      ]
    },
    next_step: "warehouse_allocation"
}

export const sqs = () =>
  new SQSClient({
    region: Deno.env.get("AWS_REGION") || "",
    credentials: {
      accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") || "",
      secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") || "",
    },
    forcePathStyle: true,
  });