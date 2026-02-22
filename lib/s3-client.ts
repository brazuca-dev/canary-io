import { S3Client } from "@aws-sdk/client-s3";

const ONE_HOUR_IN_MILLISECONDS = 3_600_000;

export const s3 = () => {
  let client;

  if (!client) {
    const expiration = new Date(Date.now() + ONE_HOUR_IN_MILLISECONDS);

    client = new S3Client({
      endpoint: Deno.env.get("S3_ENDPOINT"),
      region: Deno.env.get("AWS_REGION") ?? "",
      credentials: {
        expiration,
        accessKeyId: Deno.env.get("STORAGE_ACCESS_KEY") ?? "",
        secretAccessKey: Deno.env.get("STORAGE_SECRET_ACCESS_KEY") ?? "",
      },
      forcePathStyle: true,
    });
  }

  return client;
};
