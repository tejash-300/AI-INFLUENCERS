# -----------------------
# 1) Build Next.js app
# -----------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install Node deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy source & build
COPY . .
RUN npm run build

# ----------------------------------
# 2) Install Python (FastAPI) deps
# ----------------------------------
FROM python:3.11-slim AS python-deps
WORKDIR /app

# Install system libs needed by PyTorch, TTS, ffmpeg, etc.
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      build-essential \
      git \
      ffmpeg \
      libsndfile1 && \
    rm -rf /var/lib/apt/lists/*

# Install Python deps
COPY voice-cloning/requirements.txt ./voice-cloning/
RUN pip install --no-cache-dir -r voice-cloning/requirements.txt

# -------------------------------
# 3) Final runtime image
# -------------------------------
FROM python:3.11-slim
WORKDIR /app

# Copy over built Next.js
COPY --from=builder /app/.next       ./.next
COPY --from=builder /app/public      ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Copy over Python packages + service code
COPY --from=python-deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY voice-cloning ./voice-cloning

# Expose both ports
EXPOSE 3000 8000

# Start both services
#   - Next.js on 3000
#   - FastAPI on 8000
CMD sh -c "\
    uvicorn voice-cloning.app:app --host 0.0.0.0 --port 8000 & \
    npm start \
"
