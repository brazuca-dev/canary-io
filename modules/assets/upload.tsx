import { Context, Hono } from "hono";
import { UploadPage } from "../ui/upload.tsx";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { hash } from "node:crypto";

const upload = new Hono();

upload.get("/", (c: Context) => {
  return c.html(<UploadPage />);
});

upload.post("/upload", async (c: Context) => {
  const { file: fileMetaData } = await c.req.json<{
    file: {
      type: string,
      name: string,
      lastModified: string,
    }
  }>()
  
  const hashName = hash('sha256', `${fileMetaData.name}${fileMetaData.lastModified}`);
  const extension = fileMetaData.name.split('/').pop() || 'txt';
  
  const key = `${hashName}.${extension}`;
  
  const preSignedUrl = await getPreSignedUrl.toPost({
    contentType: fileMetaData.type,
    key: key,
  });

  return c.json({ preSignedUrl, key });
});

export { upload as UploadRoute };
