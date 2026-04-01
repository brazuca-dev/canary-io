import { serveDir } from "@std/http";

const handler = (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return Response.json({ status: "ok" });
  }

  if (url.pathname.startsWith("/static")) {
    return serveDir(request, { fsRoot: "./" });
  }

  return new Response("Not found", { status: 404 });
};

Deno.serve({ port: 4242 }, handler);
