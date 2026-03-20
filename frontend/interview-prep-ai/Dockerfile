# Use standard Node image
FROM node:18-slim AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy code and build
COPY . .
RUN npm run build


# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# ADD THIS LINE TO FIX THE 404:
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
