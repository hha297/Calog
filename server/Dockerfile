FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Use Render's dynamic port
ENV PORT=4000
EXPOSE $PORT

# Start the server
CMD ["sh", "-c", "npm start"]
