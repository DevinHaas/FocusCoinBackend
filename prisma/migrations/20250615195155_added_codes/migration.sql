-- CreateEnum
CREATE TYPE "UserSubscription" AS ENUM ('STARTER', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('WAITING', 'RUNNING', 'PAUSED', 'CANCELLED', 'PENDING', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('DISCOUNT');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "focuscoins" INTEGER NOT NULL,
    "total_generated_coins" INTEGER NOT NULL,
    "total_completed_sessions" INTEGER NOT NULL,
    "subscription" "UserSubscription" NOT NULL DEFAULT 'STARTER',
    "current_focus_session_id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusSession" (
    "id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_settings" JSONB NOT NULL,
    "reward" INTEGER NOT NULL,
    "state" "SessionState" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" UUID NOT NULL,
    "price_coins" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ProductType" NOT NULL DEFAULT 'DISCOUNT',
    "images_urls" TEXT[],
    "description" TEXT NOT NULL,
    "reference_link" TEXT NOT NULL,
    "codes" TEXT[],
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
