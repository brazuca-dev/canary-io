import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../../common/s3-client.ts";

interface GetPreSignedUrlProps {
  contentType: string;
  key: string;
}

const EXPIRES_TIME_IN_SECONDS = 10;
const BUCKET_NAME = Deno.env.get("S3_BUCKET_NAME");
const s3Client = s3(Deno.env.get("S3_EXTERNAL_ENDPOINT") || "");

export const getPreSignedUrl = {
  // Method to generate a pre-signed URL for uploading a file to S3
  toPost: ({ contentType, key }: GetPreSignedUrlProps) => {
    const command = new PutObjectCommand({
      Key: key,
      Bucket: BUCKET_NAME,
      ContentType: contentType,
    });
    return getSignedUrl(s3Client, command, { expiresIn: EXPIRES_TIME_IN_SECONDS });
  },
  // Method to generate a pre-signed URL for downloading a file from S3
  toGet: ({ key }: Pick<GetPreSignedUrlProps, 'key'>) => {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    return getSignedUrl(s3Client, command, { expiresIn: EXPIRES_TIME_IN_SECONDS });
  },
};
