import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../common/s3-client.ts";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const s3Client = s3(Deno.env.get("S3_INTERNAL_ENDPOINT") || "");
const BUCKET_NAME = Deno.env.get("S3_BUCKET_NAME");

export const getFileFromCloudStorage = async (
  key: string,
): Promise<Uint8Array<ArrayBufferLike> | null> => {
  try {
    const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
    const response = await s3Client.send(command);
    return response.Body?.transformToByteArray() || null;
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    if (error.name === "NotFound" || error.name === "NoSuchKey") return null;
    throw error;
  }
};

export const putFileToCloudStorage = async (
  key: string,
  data: Uint8Array<ArrayBufferLike>,
): Promise<void> => {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: data,
    });
    await s3Client.send(command);
  } catch (error) {
    throw error;
  }
};
