# Production Dockerfile for Webnora Kubernetes / Container Deployment
FROM nginx:alpine

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static web assets to NGINX html folder
COPY . /usr/share/nginx/html

# Expose HTTP port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
