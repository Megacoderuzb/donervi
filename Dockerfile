# --- Stage 1: Build the application ---
# Use the official Node.js 21 image
FROM node:21 AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy the dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including dev dependencies) to build the project
RUN pnpm install

# Copy the rest of your application's source code
COPY . .

# Build the application for production
RUN pnpm run build


# --- Stage 2: Create the final production image ---
FROM node:21

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy dependency files from the 'builder' stage
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install ONLY the production dependencies
RUN pnpm install --prod

# Copy the compiled application from the 'builder' stage
COPY --from=builder /app/dist ./dist

# Expose the new port for your application
EXPOSE 4000

# The command to run your compiled application in production
CMD [ "node", "dist/main.js" ]