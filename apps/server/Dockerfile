FROM oven/bun:1-slim

RUN apt-get update && apt-get install -y --no-install-recommends libvips-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=8080

COPY package.json ./

RUN bun install --production --frozen-lockfile

COPY . .

RUN chown -R bun:bun /usr/src/app
USER bun

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["bun", "run", "src/index.ts"]
