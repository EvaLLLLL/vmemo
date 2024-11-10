FROM node:20-slim

WORKDIR /app

COPY package*.json pnpm-lock.yaml ./

RUN npm install pnpm -g
RUN pnpm i

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]