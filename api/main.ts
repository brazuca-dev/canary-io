import { Hono } from "hono";
import { logger } from "hono/logger";
import { UploadRoute } from "./features/upload/index.tsx";
import { ViewRoute } from "./features/view/index.tsx";
import { CDNRoute } from "./features/cdn/index.ts";

const app = new Hono();

app.use(logger());

app.route("/", UploadRoute);
app.route("/", ViewRoute);
app.route("/", CDNRoute)

Deno.serve(app.fetch);