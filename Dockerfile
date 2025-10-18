# Multi-stage build
FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY backend/ ./backend/

# Install backend dependencies
RUN npm install --production

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 3000

# Start backend server
CMD ["node", "backend/server.js"]