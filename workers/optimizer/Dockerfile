FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /worker/optimizer
COPY /common /common
COPY /deno.json /deno.json
COPY . .
RUN deno cache --allow-all main.ts

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /worker/optimizer
COPY --from=builder /worker/optimizer /worker/optimizer
COPY /common /common
COPY /deno.json /deno.json
COPY . .
CMD ["run", "--allow-run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-sys", "--watch-hmr", "main.ts"]