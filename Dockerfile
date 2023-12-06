FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .


COPY prisma ./prisma/
COPY scripts scripts
COPY src src

RUN bun install

COPY tsconfig.json .

RUN bunx prisma generate

ENV NODE_ENV production

EXPOSE 3000