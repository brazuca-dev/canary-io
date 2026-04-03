import { s3 } from "@storage";
import { sqs } from "@queue-message";
import sharp from "sharp";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";

const QUEUE_URL = `${Deno.env.get("SQS_BASE_URL")}/${
  Deno.env.get("ACCOUNT_ID")
}/${Deno.env.get("SQS_OPTIMIZER_QUEUE_NAME")}`;

const sqsClient = sqs(QUEUE_URL);
const s3Client = s3(Deno.env.get("S3_INTERNAL_ENDPOINT") || "");

while (true) {
  try {
    const queue = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1,
        WaitTimeSeconds: 20,
      }),
    );

    if (!queue.Messages || queue.Messages.length === 0) continue;

    const lastMessage = queue.Messages[queue.Messages.length - 1];
    if (!lastMessage.Body?.includes("Records")) {
      await sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: QUEUE_URL,
          ReceiptHandle: lastMessage.ReceiptHandle,
        }),
      );
      continue;
    }

    const { Records } = JSON.parse(lastMessage.Body);
    if (!Records || !Records.length) continue;

    const lastRecord = Records[Records.length - 1];

    const getObjectCommand = new GetObjectCommand({
      Bucket: lastRecord.s3.bucket.name,
      Key: lastRecord.s3.object.key,
    });
    const s3Response = await s3Client.send(getObjectCommand);
    const imageArrayBuffer = await s3Response.Body?.transformToByteArray();

    if (!imageArrayBuffer) {
      throw new Error("Falha ao obter o buffer da imagem.");
    }

    const imageMetadata = await sharp(imageArrayBuffer).metadata();
    const { width, height } = imageMetadata;

    const sizeReductionPer = 0.2;
    const newWidth = Math.trunc(width - (width * sizeReductionPer)) || width;
    const newHeight = Math.trunc(height - (height * sizeReductionPer)) ||
      height;

    const optimizedImage = await sharp(imageArrayBuffer)
      .resize({
        height: newHeight,
        width: newWidth,
        fit: sharp.fit.cover,
        withoutEnlargement: true,
      })
      .webp({ quality: 70 })
      .toBuffer();

    const hash = lastRecord.s3.object.key.split("/").pop()?.split(".")[0];
    const optimizedKey = `optimized/${hash}.webp`;

    const putObjectCommand = new PutObjectCommand({
      Bucket: lastRecord.s3.bucket.name,
      Key: optimizedKey,
      Body: optimizedImage,
      ContentType: "image/webp",
    });
    const putOutput = await s3Client.send(putObjectCommand);

    const nextQueueUrl = `${Deno.env.get("SQS_BASE_URL")}/${
      Deno.env.get("ACCOUNT_ID")
    }/${Deno.env.get("SQS_NEXT_QUEUE_NAME")}`;

    await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: nextQueueUrl,
        MessageBody: JSON.stringify({
          object: {
            key: optimizedKey,
            bucket: lastRecord.s3.bucket.name,
            etag: putOutput.ETag,
            original_sequencer: lastRecord.s3.object.sequencer,
          },
          status: "optimized",
          timestamp: new Date().toISOString(),
        }),
      }),
    );

    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: lastMessage.ReceiptHandle,
      }),
    );
  } catch (e) {
    e instanceof Error &&
      console.error("❌ Erro no ciclo de otimização:", e);
    await new Promise((r) => setTimeout(r, 1000));
  }
}
