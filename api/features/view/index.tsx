import { Context, Hono } from "hono";
import { getPreSignedUrl } from "../../lib/pre-signed-url.ts";
import { ViewAssetUploadedPage } from "./ui.tsx";

const view = new Hono();

view.get("/view/:hash", async (c: Context) => {
  const { hash } = c.req.param();
  const { file = "raw", type } = c.req.query()
  
  const key = `${file}/${hash}.${type}`;
  const preSignedUrl = await getPreSignedUrl.toGet({ key });
  
  return c.html(<ViewAssetUploadedPage assetUrl={preSignedUrl} type={type} />);
});

export { view as ViewRoute };