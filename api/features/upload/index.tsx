import { Context, Hono } from "hono";
import { UploadPage } from "./ui.tsx";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { renameFile } from "./service.ts";

const upload = new Hono();

upload.get("/", (c: Context) => c.html(<UploadPage />));

upload.post("/upload", async (c: Context) => {
  const { fileMetaData } = await c.req.json<{
    fileMetaData: {
      type: string;
      name: string;
      lastModified: string;
    };
  }>();

  const key = renameFile(
    fileMetaData.name,
    fileMetaData.lastModified,
    fileMetaData.type,
  );

  const preSignedUrl = await getPreSignedUrl.toPost({
    contentType: fileMetaData.type,
    key: key,
  });

  return c.json({ preSignedUrl, key });
});

export { upload as UploadRoute };
