-- CreateEnum
CREATE TYPE "UserSubscription" AS ENUM ('STARTER', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('WAITING', 'RUNNING', 'PAUSE', 'CANCELLED', 'PENDING', 'FINISHED');

-- CreateEnum
CREATE TYPE "TimeManagementTechnique" AS ENUM ('POMODORO', 'SIMPLE', 'FLOWTIME', 'STOPWATCH');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "focuscoins" BIGINT NOT NULL,
    "subscription" "UserSubscription" NOT NULL DEFAULT 'STARTER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FocusSession" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "session_settings" JSONB NOT NULL,
    "reward" BIGINT NOT NULL,
    "state" "SessionState" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FocusSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionSettings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "time_management_technique" "TimeManagementTechnique" NOT NULL DEFAULT 'POMODORO',
    "focus_time" INTEGER NOT NULL,
    "pause_time" INTEGER NOT NULL,
    "num_of_sessions" INTEGER NOT NULL,

    CONSTRAINT "SessionSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "SessionSettings_user_id_key" ON "SessionSettings"("user_id");

-- AddForeignKey
ALTER TABLE "FocusSession" ADD CONSTRAINT "FocusSession_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSettings" ADD CONSTRAINT "SessionSettings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
