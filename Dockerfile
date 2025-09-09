# Use the official Nginx image as the base image
FROM nginx:latest

# Copy the local index.html to the Nginx HTML directory
COPY ./index.html /usr/share/nginx/html/index.html

# Copy the local styles.css to the Nginx HTML directory
COPY ./styles.css /usr/share/nginx/html/styles.css

# Copy the local script.js to the Nginx HTML directory
COPY ./script.js /usr/share/nginx/html/script.js

# Copy the images folder to the Nginx HTML directory
COPY ./images /usr/share/nginx/html/images

# Expose port 80 inside the container
EXPOSE 80