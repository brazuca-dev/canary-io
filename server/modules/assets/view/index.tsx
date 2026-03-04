import { Context, Hono } from "hono";
import { getPreSignedUrl } from "../../../lib/pre-signed-url.ts";
import { ViewAssetUploadedPage } from "./ui.tsx";
import { serveStatic } from "hono/deno";

const view = new Hono();

view.get("/view/:key", async (c: Context) => {
  const key = c.req.param('key');
  const type = key.split('.').pop() || 'unknown';
  
  const preSignedUrl = await getPreSignedUrl.toGet({ key });
  
  return c.html(<ViewAssetUploadedPage assetUrl={preSignedUrl} type={type} />);
});

view.get("/static/file-element.js", serveStatic({ path: "./server/static/file-element.js" }));

export { view as ViewRoute };
