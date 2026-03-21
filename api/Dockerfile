FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /builder
COPY /common /common
COPY /api .
RUN deno cache main.ts

FROM debian:bookworm-slim AS keys

RUN apt-get update && apt-get install -y openssl bash && rm -rf /var/lib/apt/lists/*
WORKDIR /c2pa
COPY /scripts/c2pa/keys.sh ./keys.sh
RUN chmod +x ./keys.sh && bash ./keys.sh

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /api
COPY --from=builder /builder .
COPY /common /common
COPY --from=keys /c2pa/private.key ./features/cdn/files/
COPY --from=keys /c2pa/chain.pem ./features/cdn/files/
COPY --from=keys /c2pa/root.pem ./features/cdn/files/

RUN ls -la ./features/cdn/files/

CMD ["run", "-P", "--watch-hmr", "main.ts"]