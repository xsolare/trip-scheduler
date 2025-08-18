FROM node:lts-trixie-slim as build

WORKDIR /any

COPY ./app/server/ ./

CMD ["nginx", "-g", "daemon off;"]