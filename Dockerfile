FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

COPY prisma ./prisma/
COPY scripts scripts
COPY src src

RUN bun install

COPY tsconfig.json .

RUN bunx prisma generate

ENV NODE_ENV production

EXPOSE 3000