# --- Stage 1: Build the application ---
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install all dependencies to build the project
RUN npm install

COPY . .

# Build the application
RUN npm run build


# --- Stage 2: Create the final, small production image ---
FROM node:18-alpine

WORKDIR /app

# Copy only the files needed for production from the 'builder' stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install ONLY the production dependencies
RUN npm install --omit=dev

# Expose the port the app runs on
EXPOSE 3001

# THE FIX IS HERE:
# Run the compiled JavaScript file directly with Node.js for production.
CMD ["node", "dist/main.js"]