import { Context, Hono } from "hono";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { ViewAssetUploadedPage } from "../ui/view.tsx";

const view = new Hono();

view.get("/view/:key", async (c: Context) => {
  const key = c.req.param('key');
  
  const preSignedUrl = await getPreSignedUrl.toGet({ key });
  return c.html(<ViewAssetUploadedPage assetUrl={preSignedUrl} />);
});

export { view as ViewRoute };
