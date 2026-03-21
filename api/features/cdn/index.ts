import { Hono } from "hono";
import { serveStatic } from "hono/deno";

const cdn = new Hono().basePath("content/")

cdn.get(
  "/upload-files.js",
  serveStatic({ path: "./features/cdn/files/upload-files.js" }),
);

cdn.get(
  "/file-element.js",
  serveStatic({ path: "./features/cdn/files/file-element.js" }),
);

cdn.get(
  "/trust-anchor.pem",
  serveStatic({ path: "./features/cdn/files/chain.pem" }),
);

cdn.get(
  "/private.key",
  serveStatic({ path: "./features/cdn/files/private.key" }),
);

export { cdn as CDNRoute }