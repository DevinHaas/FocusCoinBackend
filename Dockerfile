FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install

COPY prisma prisma
COPY scripts scripts
COPY src src
COPY tsconfig.json .

RUN prisma generate

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000