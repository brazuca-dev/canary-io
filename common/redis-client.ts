import { connect } from "@db/redis";

export const redis = await connect({
  hostname: Deno.env.get("REDIS_HOST") ?? "",
  port: Deno.env.get("REDIS_PORT") ?? 6379,
});

export const C2PA_INJECTION_QUEUE = "c2pa_injection_queue";
