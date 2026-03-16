FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /worker/c2pa
COPY /common /common
COPY /workers/c2pa .
RUN deno cache main.ts

FROM alpine:latest AS keys

WORKDIR /c2pa
COPY /scripts/c2pa/keys.sh script/keys.sh
RUN chmod +x script/keys.sh
ENTRYPOINT [ "./script/keys.sh" ]

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /worker/c2pa
COPY --from=builder /worker/c2pa /worker/c2pa
COPY /common /common
COPY --from=keys /c2pa .

CMD ["run", "-P", "--watch-hmr", "main.ts"]