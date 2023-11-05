-- CreateEnum
CREATE TYPE "UserSubscription" AS ENUM ('STARTER', 'PREMIUM');

-- CreateEnum
CREATE TYPE "ProductTag" AS ENUM ('DONATE', 'GENERAL_PRODUCTS', 'TOP_PICKS', 'SPECIAL_OFFERS');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('DIGITAL', 'HEALTH_AND_WELLNESS', 'TECHNOLOGY', 'NUTRITION', 'EVENT_TICKET', 'APPAREL');

-- CreateEnum
CREATE TYPE "StatusFriendship" AS ENUM ('REQUESTED', 'ACCEPTED', 'DECLINED', 'BLOCKED', 'FOLLOWING', 'FOLLOWED', 'NONE');

-- CreateEnum
CREATE TYPE "SessionState" AS ENUM ('WAITING', 'RUNNING', 'PAUSE', 'CANCELLED', 'PENDING', 'FINISHED');

-- CreateEnum
CREATE TYPE "ParticipantState" AS ENUM ('JOINED', 'FOCUSING', 'PAUSED', 'LEFT');

-- CreateTable
CREATE TABLE "USER" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "focuscoins" INTEGER,
    "subscription" "UserSubscription" NOT NULL,
    "profile_picture_url" TEXT NOT NULL,
    "session_settings" JSONB,
    "email" TEXT NOT NULL,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthUser" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AuthUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_HISTORY" (
    "id" SERIAL NOT NULL,
    "operation" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,

    CONSTRAINT "USER_HISTORY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "USER_PRODUCT" (
    "bought_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "USER_PRODUCT_pkey" PRIMARY KEY ("user_id","product_id")
);

-- CreateTable
CREATE TABLE "TAGS" (
    "id" SERIAL NOT NULL,
    "tag" "ProductTag" NOT NULL,

    CONSTRAINT "TAGS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCT" (
    "id" SERIAL NOT NULL,
    "price_coins" BIGINT NOT NULL,
    "price_usd" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "reference_link" TEXT,
    "published_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3),
    "amount" BIGINT,
    "image_urls" TEXT[],
    "type" "ProductType" NOT NULL,

    CONSTRAINT "PRODUCT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCT_HISTORY" (
    "id" SERIAL NOT NULL,
    "operation" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER,

    CONSTRAINT "PRODUCT_HISTORY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCT_TAGS" (
    "tag_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "PRODUCT_TAGS_pkey" PRIMARY KEY ("tag_id","product_id")
);

-- CreateTable
CREATE TABLE "PARTICIPANT" (
    "session_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "doubled" BOOLEAN NOT NULL,
    "state" "ParticipantState" NOT NULL,

    CONSTRAINT "PARTICIPANT_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "PARTICIPANT_HISTORY" (
    "id" SERIAL NOT NULL,
    "operation" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participantSession_id" INTEGER,

    CONSTRAINT "PARTICIPANT_HISTORY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FRIENDSHIP" (
    "user_id" TEXT NOT NULL,
    "friend_id" TEXT NOT NULL,
    "status" "StatusFriendship" NOT NULL,

    CONSTRAINT "FRIENDSHIP_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateTable
CREATE TABLE "FRIENDSHIP_HISTORY" (
    "id" SERIAL NOT NULL,
    "operation" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "friendshipUser_id" TEXT,
    "friendshipFriend_id" TEXT,

    CONSTRAINT "FRIENDSHIP_HISTORY_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FOCUSSESSION" (
    "id" SERIAL NOT NULL,
    "session_settings" JSONB NOT NULL,
    "reward" BIGINT NOT NULL,
    "state" "SessionState" NOT NULL,

    CONSTRAINT "FOCUSSESSION_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FOCUSSESSION_HISTORY" (
    "id" SERIAL NOT NULL,
    "operation" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "focusSessionId" INTEGER,

    CONSTRAINT "FOCUSSESSION_HISTORY_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USER_username_key" ON "USER"("username");

-- AddForeignKey
ALTER TABLE "USER" ADD CONSTRAINT "USER_id_fkey" FOREIGN KEY ("id") REFERENCES "AuthUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USER_HISTORY" ADD CONSTRAINT "USER_HISTORY_userId_fkey" FOREIGN KEY ("userId") REFERENCES "USER"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PRODUCT_HISTORY" ADD CONSTRAINT "PRODUCT_HISTORY_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PRODUCT"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PARTICIPANT_HISTORY" ADD CONSTRAINT "PARTICIPANT_HISTORY_participantSession_id_fkey" FOREIGN KEY ("participantSession_id") REFERENCES "PARTICIPANT"("session_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FRIENDSHIP_HISTORY" ADD CONSTRAINT "FRIENDSHIP_HISTORY_friendshipUser_id_friendshipFriend_id_fkey" FOREIGN KEY ("friendshipUser_id", "friendshipFriend_id") REFERENCES "FRIENDSHIP"("user_id", "friend_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FOCUSSESSION_HISTORY" ADD CONSTRAINT "FOCUSSESSION_HISTORY_focusSessionId_fkey" FOREIGN KEY ("focusSessionId") REFERENCES "FOCUSSESSION"("id") ON DELETE SET NULL ON UPDATE CASCADE;
