import { S3Client } from "@aws-sdk/client-s3";

export const s3 = () => {
  let client;

  if (!client) {
    client = new S3Client({
      endpoint: Deno.env.get("S3_ENDPOINT"),
      region: Deno.env.get("AWS_REGION") ?? "",
      credentials: {
        accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") ?? "",
        secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "",
      },
      forcePathStyle: true,
    });
  }

  return client;
};
