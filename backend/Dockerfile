#syntax=docker/dockerfile:1.7
FROM node:22-alpine
WORKDIR /app

# Optimize npm cache location (and enable cache mounts with BuildKit)
ENV NPM_CONFIG_CACHE=/root/.npm

# Install deps based on lockfile if present
COPY package*.json ./
# Use cache mount when BuildKit is on; still works fine when it's off
RUN --mount=type=cache,target=/root/.npm \
    sh -c 'if [ -f package-lock.json ]; then npm ci --no-audit --progress=false; else npm install --no-audit --progress=false; fi'

# Now copy the rest
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
