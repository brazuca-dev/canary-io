import { Context, Hono } from "hono";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { ViewAssetUploadedPage } from "./ui.tsx";

const view = new Hono();

view.get("/view/:hash", async (c: Context) => {
  const { hash } = c.req.param();
  const { file = "original", type } = c.req.query()
  
  const key = `${hash}/${file}.${type}`;
  const preSignedUrl = await getPreSignedUrl.toGet({ key });
  
  return c.html(<ViewAssetUploadedPage assetUrl={preSignedUrl} />);
});

export { view as ViewRoute };