import { SQSClient } from "@aws-sdk/client-sqs";

export const sqs = (url: string) =>
  new SQSClient({
    endpoint: url,
    region: Deno.env.get("AWS_REGION") || "",
    credentials: {
      accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") || "",
      secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") || "",
    },
    forcePathStyle: true,
  });