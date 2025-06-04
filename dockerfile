FROM node:20-bullseye-slim

# Set Puppeteer env BEFORE npm install
ENV PUPPETEER_ARCH=arm64

# Install dependencies needed by Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    wget \
    libu2f-udev \
    libvulkan1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm cache clean --force

RUN npm install

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "sleep 5 && npx prisma db push && npm start"]
