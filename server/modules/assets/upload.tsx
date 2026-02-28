import { Context, Hono } from "hono";
import { UploadPage } from "../ui/upload.tsx";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { hash } from "node:crypto";
import { serveStatic } from "hono/deno";
import { createC2PATask, pushC2PATaskToQueue } from "../../../common/c2pa-task.ts";

interface PostUploadVariables { key: string }

const upload = new Hono<{ Variables: PostUploadVariables }>();

upload.get("/", (c: Context) => c.html(<UploadPage />));
upload.get(
  "/static/upload-files.js",
  serveStatic({ path: "./server/static/upload-files.js" }),
);

upload.use('/upload', async (c, next) => {
  await next();
  
  const key = c.get('key')
  const c2paTask = createC2PATask(key)
  await pushC2PATaskToQueue(c2paTask);
});
upload.post("/upload", async (c: Context) => {
  const { file: fileMetaData } = await c.req.json<{
    file: {
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

  const key = `${hashName}.${extension}`;

  const preSignedUrl = await getPreSignedUrl.toPost({
    contentType: fileMetaData.type,
    key: key,
  });

  c.set('key', key);
  return c.json({ preSignedUrl, key });
});

export { upload as UploadRoute };
