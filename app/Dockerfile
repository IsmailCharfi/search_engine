# Use an official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Set the command to start the app (assuming you use serve to serve the static files)
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]

# Expose the port the app will run on
EXPOSE 3000
