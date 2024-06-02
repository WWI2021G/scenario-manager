# Use the official Node.js image as a base image
FROM node:18.17-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run Jest tests
RUN npm run test

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Command to run the app
CMD ["npm", "start"]
