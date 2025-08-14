FROM node:lts-trixie-slim as build

WORKDIR /any

COPY ./app/client/ ./

RUN npm install

RUN npm run build

FROM nginx:stable-bookworm-perl

COPY --from=build /any /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
