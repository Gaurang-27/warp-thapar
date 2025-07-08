-- AlterEnum
ALTER TYPE "SubType" ADD VALUE 'trial';

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;
