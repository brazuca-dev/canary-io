import { Context, Hono } from "hono";
import { UploadPage } from "./ui.tsx";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { hash } from "node:crypto";
import { serveStatic } from "hono/deno";

const upload = new Hono();

upload.get("/", (c: Context) => c.html(<UploadPage />));
upload.get(
  "/static/upload-files.js",
  serveStatic({ path: "./server/static/upload-files.js" }),
);

upload.post("/upload", async (c: Context) => {
  const { fileMetaData } = await c.req.json<{
    fileMetaData: {
      type: string;
      name: string;
      lastModified: string;
    };
  }>();

  const hashName = hash(
    "sha256",
    `${fileMetaData.name}${fileMetaData.lastModified}`,
  );
  const extension = fileMetaData.type.split("/").pop() || "txt";
  const key = `original/${hashName}.${extension}`;

  const preSignedUrl = await getPreSignedUrl.toPost({
    contentType: fileMetaData.type,
    key: key,
  });

  return c.json({ preSignedUrl, key });
});

export { upload as UploadRoute };