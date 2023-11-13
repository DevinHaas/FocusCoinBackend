-- CreateEnum
CREATE TYPE "UserSubscription" AS ENUM ('STARTER', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('WAITING', 'RUNNING', 'PAUSED', 'CANCELLED', 'PENDING', 'FINISHED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "focuscoins" INTEGER NOT NULL,
    "subscription" "UserSubscription" NOT NULL DEFAULT 'STARTER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusSession" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_settings" JSONB NOT NULL,
    "reward" INTEGER NOT NULL,
    "state" "SessionState" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
