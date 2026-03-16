FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /builder
COPY /common /common
COPY /api .
RUN deno cache main.ts

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /api
COPY --from=builder /builder .
COPY /common /common

CMD ["run", "-P", "--watch-hmr", "main.ts"]