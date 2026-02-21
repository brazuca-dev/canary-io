import { Hono } from "hono";
import { UploadRoute } from "./modules/assets/upload.tsx";
import { ViewRoute } from "./modules/assets/view.tsx";

const app = new Hono();

app.route("/", UploadRoute);
app.route("/", ViewRoute);

Deno.serve(app.fetch);
