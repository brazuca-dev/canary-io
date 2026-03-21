import { s3 } from "@storage";
import { sqs } from "@queue-message";
import type { S3EventNotification } from "./interfaces.ts";
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Builder, LocalSigner } from "@contentauth/c2pa-node";
import { Buffer } from "node:buffer";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const sqsClient = sqs();
const QUEUE_URL = "http://localstack:4566/000000000000/test";

const s3Client = s3(Deno.env.get("S3_INTERNAL_ENDPOINT") || "");

while (true) {
  try {
    const queue = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 15, // Long Polling: espera até 20s por uma mensagem
      }),
    );

    if (!queue.Messages) continue;

    const lastMessage = queue.Messages[queue.Messages.length - 1];
    const { Records }: S3EventNotification = JSON.parse(
      lastMessage.Body || "{}",
    );

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

    const [certRes, keyRes] = await Promise.all([
      fetch("http://deno_api:8000/content/trust-anchor.pem"),
      fetch("http://deno_api:8000/content/private.key"),
    ]);

    const certArrayBuffer = await certRes.arrayBuffer();
    const keyArrayBuffer = await keyRes.arrayBuffer();

    const certBuffer = Buffer.from(certArrayBuffer);
    const keyBuffer = Buffer.from(keyArrayBuffer);

    const signer = LocalSigner.newSigner(
      certBuffer,
      keyBuffer,
      "es256",
      "http://timestamp.digicert.com",
    );

    const builder = Builder.withJson({
      claim_generator: "canary.io/poc",
      assertions: [
        {
          label: "c2pa.actions",
          data: {
            actions: [{ action: "c2pa.created" }],
          },
        },
        {
          label: "c2pa.author",
          data: { name: "brazucadeveloper" },
        },
      ],
    });
    const imagebuffer = Buffer.from(imageArrayBuffer);

    const imageExtension = lastRecord.s3.object.key.split(".").pop();
    const mimeType = `image/${imageExtension}`;
    const hash = lastRecord.s3.object.key.match(/^\w*[^\/]/)![0];
    const outputPath = `/tmp/${hash}_signed.${imageExtension}`;

    const signedImageBuffer = builder.sign(signer, {
      buffer: imagebuffer,
      mimeType: mimeType,
    }, {
      path: outputPath,
      mimeType: mimeType,
    });

    if (!signedImageBuffer) throw new Error("Falha ao assinar o manifesto.");
    const signedImage = await Deno.readFile(outputPath);
    
    const command = new PutObjectCommand({
      Bucket: Deno.env.get("S3_BUCKET_NAME"),
      Key: `${hash}/signed.${imageExtension}`,
      Body: signedImage,
      ContentType: mimeType,
      Metadata: {
        "x-amz-meta-c2pa-signed": "true",
      },
    });
    s3Client.send(command);

    sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: lastMessage.ReceiptHandle,
      }),
    );
    console.log("✅ Mensagem processada e removida.");
  } catch (e) {
    console.error("❌ Erro ao processar mensagem:\n", e);
  }
}
