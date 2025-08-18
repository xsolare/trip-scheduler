FROM node:lts-trixie-slim as build

WORKDIR /data

COPY ./app/client/* ./

RUN npm install

RUN bun run build:web

FROM node:lts-trixie-slim

WORKDIR /data

RUN npm i bun -g

COPY --from=build /data/dist ./dist
COPY --from=build --from=builder /data/package.json ./package.json

CMD ["bun", "--bun", "run" "dist/index.js;"]
