import { Hono } from "hono";
import { serveStatic } from 'hono/deno'
import { UploadRoute } from "./modules/assets/upload.tsx";
import { ViewRoute } from "./modules/assets/view.tsx";

const app = new Hono();

app.use('/static/', serveStatic({ root: './' }))

app.route("/", UploadRoute);
app.route("/", ViewRoute);

Deno.serve(app.fetch);
