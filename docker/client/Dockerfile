FROM node:lts-trixie-slim as build

WORKDIR /data

COPY ./app/client/* ./

RUN npm install

RUN bun run build:web

FROM nginx:stable-bookworm-perl

WORKDIR /data

COPY --from=build /data/dist ./dist
COPY --from=build --from=builder /data/package.json ./package.json

CMD ["nginx", "-g", "daemon off;"]
