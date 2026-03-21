FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /worker/c2pa
COPY /common /common
COPY /workers/c2pa .
RUN deno cache main.ts

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /worker/c2pa
COPY --from=builder /worker/c2pa /worker/c2pa
COPY /common /common

CMD ["run", "-P", "--watch-hmr", "main.ts"]