# Multi-stage build for production
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build-time environment variables
ARG VITE_INVESTMENT_API_URL
ARG VITE_FASTAPI_INVESTMENT_API_KEY
ENV VITE_INVESTMENT_API_URL=$VITE_INVESTMENT_API_URL
ENV VITE_FASTAPI_INVESTMENT_API_KEY=$VITE_FASTAPI_INVESTMENT_API_KEY

# Build the application
RUN npm run build

# Production image using nginx
FROM nginx:alpine

# Copy custom nginx configuration for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
