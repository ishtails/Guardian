# Stage 1: Install dependencies
FROM node:lts as builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Stage 2: Create the final container
FROM redis:latest

# Expose Redis port
EXPOSE 6379

# Set the working directory to /app
WORKDIR /app

# Copy the application source code and dependencies from the previous stage
COPY --from=builder /app .

# Install production dependencies (excluding devDependencies)
RUN npm install --only=production

# Command to run Redis and the Node.js application
CMD ["sh", "-c", "redis-server & node server.js"]
