FROM node:lts-alpine

# Install Redis and other dependencies
RUN apk add --no-cache redis

ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 8000

# Change ownership of the application directory
RUN chown -R node /usr/src/app
USER node

# Run Node.js server
CMD ["redis-server" ,"node", "server.js"]
