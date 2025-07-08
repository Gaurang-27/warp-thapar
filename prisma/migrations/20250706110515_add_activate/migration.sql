-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trialAvailable" BOOLEAN NOT NULL DEFAULT true;
