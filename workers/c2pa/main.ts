import { s3 } from "@storage";
import { sqs } from "@queue-message";
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
} from "@aws-sdk/client-sqs";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Builder, LocalSigner } from "@contentauth/c2pa-node";
import { Buffer } from "node:buffer";

const [certRes, keyRes] = await Promise.all([
  fetch("http://deno_api:8000/content/trust-anchor.pem"),
  fetch("http://deno_api:8000/content/private.key"),
]);
const certBuffer = Buffer.from(await certRes.arrayBuffer());
const keyBuffer = Buffer.from(await keyRes.arrayBuffer());

const signer = LocalSigner.newSigner(
  certBuffer,
  keyBuffer,
  "es256",
  "http://timestamp.digicert.com",
);

const QUEUE_URL = `${Deno.env.get("SQS_BASE_URL")}/${
  Deno.env.get("ACCOUNT_ID")
}/${Deno.env.get("SQS_CONTENT_AUTH_QUEUE_NAME")}`;

const sqsClient = sqs(QUEUE_URL);
const s3Client = s3(Deno.env.get("S3_INTERNAL_ENDPOINT") || "");

while (true) {
  try {
    const queue = await sqsClient.send(
      new ReceiveMessageCommand({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 1, // Processar 1 por vez garante melhor controle de erro individual
        WaitTimeSeconds: 20,
      }),
    );

    if (!queue.Messages || queue.Messages.length === 0) continue;
    const lastMessage = queue.Messages[queue.Messages.length - 1];

    const body = JSON.parse(lastMessage.Body || "{}");
    const { object } = body;
    
    const s3Response = await s3Client.send(
      new GetObjectCommand({
        Bucket: object.bucket,
        Key: object.key,
      }),
    );
    const imageArrayBuffer = await s3Response.Body?.transformToByteArray();
    if (!imageArrayBuffer) throw new Error("Image buffer is empty");

    const builder = Builder.withJson({
      claim_generator: "canary.io/poc",
      assertions: [
        {
          label: "c2pa.actions",
          data: { actions: [{ action: "c2pa.created" }] },
        },
        { label: "c2pa.author", data: { name: "brazucadeveloper" } },
      ],
    });

    const extension = object.key.split(".").pop();
    const mimeType = `image/${extension === "jpg" ? "jpeg" : extension}`;
    const hash = object.key.split("/").pop()?.split(".")[0];
    const tempPath =
      `${Deno.makeTempDirSync()}/signed_${Date.now()}.${extension}`;

    builder.sign(signer, {
      mimeType,
      buffer: Buffer.from(imageArrayBuffer),
    }, {
      mimeType,
      path: tempPath,
    });

    const signedImage = await Deno.readFile(tempPath);

    await s3Client.send(
      new PutObjectCommand({
        Bucket: Deno.env.get("S3_BUCKET_NAME"),
        Key: `signed/${hash}.${extension}`,
        Body: signedImage,
        ContentType: mimeType,
        Metadata: {
          "x-amz-meta-c2pa-signed": "true",
          "x-amz-meta-original-sequencer": object.sequencer || "n/a",
        },
      }),
    );

    await Deno.remove(tempPath);
    await sqsClient.send(
      new DeleteMessageCommand({
        QueueUrl: QUEUE_URL,
        ReceiptHandle: lastMessage.ReceiptHandle,
      }),
    );
  } catch (e) {
    e instanceof Error &&
      console.error("❌ Erro no ciclo de assinatura:", e);
    await new Promise((r) => setTimeout(r, 1000));
  }
}
