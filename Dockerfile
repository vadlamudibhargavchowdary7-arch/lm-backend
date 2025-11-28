# Use official Node.js runtime
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy all backend files
COPY . .

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
