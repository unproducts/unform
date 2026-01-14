FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm i -g yarn
RUN yarn
RUN yarn build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output /app/.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]