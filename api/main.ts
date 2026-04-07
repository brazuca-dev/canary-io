import { Hono } from "hono";
import { logger } from "hono/logger";
import { UploadRoute } from "./features/upload/index.tsx";
import { ViewRoute } from "./features/view/index.tsx";

const app = new Hono();

app.use(logger());

app.route("/", UploadRoute);
app.route("/", ViewRoute);

Deno.serve(app.fetch);