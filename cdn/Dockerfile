FROM denoland/deno:debian-2.7.1 AS builder

WORKDIR /cdn
COPY /cdn .
RUN deno cache main.ts

FROM debian:bookworm-slim AS keys

RUN apt-get update && apt-get install -y openssl bash && rm -rf /var/lib/apt/lists/*

WORKDIR /c2pa
COPY /scripts/c2pa/keys.sh ./keys.sh
RUN chmod +x ./keys.sh && bash ./keys.sh

FROM denoland/deno:debian-2.7.1 AS final

WORKDIR /cdn
COPY --from=builder /cdn .
COPY --from=keys /c2pa/private.key ./static/
COPY --from=keys /c2pa/chain.pem ./static/
COPY --from=keys /c2pa/root.pem ./static/

CMD ["run", "-P", "--watch-hmr", "main.ts"]