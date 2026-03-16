FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /worker/optimizer
COPY /common /common
COPY /workers/optimizer .
RUN deno cache main.ts

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /worker/optimizer
COPY --from=builder /worker/optimizer /worker/optimizer
COPY /common /common
CMD ["run", "-P", "--watch-hmr", "main.ts"]