# Use Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install

# Copy the entire project
COPY . .

# Expose Metro bundler port
EXPOSE 8081

# Start Metro bundler
CMD ["yarn", "start"]
