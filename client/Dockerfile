# Stage 1: Build

FROM node:22-alpine AS builder

WORKDIR /app

# copy into current working directory (./ is equivalant to /app/)
COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production Runtime

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Using CMD for overriding facility at different environment
# Also to supply default args to nginx image’s existing entrypoint command
CMD ["nginx", "-g", "daemon off;"]