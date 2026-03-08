FROM alpine:latest AS builder

WORKDIR /worker/c2pa
COPY /deno.json /deno.json
COPY /common /common
COPY . .
RUN deno cache --allow-all main.ts

FROM alpine:latest AS keys

WORKDIR /c2pa
COPY /scripts/c2pa/keys.sh script/keys.sh
RUN chmod +x ./script/keys.sh
RUN ./script/keys.sh

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /worker/c2pa
COPY --from=builder /worker/c2pa /worker/c2pa
COPY /common /common
COPY /deno.json /deno.json
COPY --from=keys /c2pa .

CMD ["run", "--allow-run", "--allow-net", "--allow-read", "--allow-write", "--allow-env", "--allow-sys", "--watch-hmr", "main.ts"]