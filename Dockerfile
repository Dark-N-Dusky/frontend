FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env.production.local .env

RUN npm run build

FROM node:24-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env .env

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM node:24-alpine AS production

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]