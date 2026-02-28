FROM alpine:latest AS builder

RUN apk add --no-cache curl tar

RUN curl -L https://github.com/contentauth/c2pa-rs/releases/latest/download/c2patool-v0.26.30-x86_64-unknown-linux-gnu.tar.gz | tar -xz

FROM denoland/deno:debian-2.7.1 AS final

COPY --from=builder /c2patool/c2patool /usr/local/bin/c2patool
RUN chmod +x /usr/local/bin/c2patool

WORKDIR /worker/c2pa

COPY deno.json /worker/deno.json
COPY deno.lock /worker/deno.lock
COPY common/ /common
COPY workers/c2pa/ /worker/c2pa

# Permissões necessárias:
# --allow-run (c2pa-tool), --allow-net (redis), --allow-read/write (arquivos)
CMD ["run", "--allow-run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-sys", "--watch-hmr", "main.ts"]
