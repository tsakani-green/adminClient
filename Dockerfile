FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application (for production)
# RUN npm run build

EXPOSE 5173

# For development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]