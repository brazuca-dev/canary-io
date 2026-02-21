import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3-client.ts";

interface GetPreSignedUrlProps {
  contentType: string;
  key: string;
}

const BUCKET_NAME = Deno.env.get("S3_BUCKET_NAME");

export const getPreSignedUrl = {
  // Method to generate a pre-signed URL for uploading a file to S3
  toPost: ({ contentType, key }: GetPreSignedUrlProps) => {
    const client = s3();
    const command = new PutObjectCommand({
      Key: key,
      Bucket: BUCKET_NAME,
      ContentType: contentType,
    });
    return getSignedUrl(client, command, { expiresIn: 3600 });
  },
  // Method to generate a pre-signed URL for downloading a file from S3
  toGet: ({ key }: Pick<GetPreSignedUrlProps, 'key'>) => {
    const client = s3();
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    return getSignedUrl(client, command, { expiresIn: 3600 });
  },
};
