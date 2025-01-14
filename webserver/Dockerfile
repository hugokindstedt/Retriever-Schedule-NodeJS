# Use the official Node.js image as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["node", "server.js"]