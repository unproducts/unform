FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn
RUN yarn build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.output /app/.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]