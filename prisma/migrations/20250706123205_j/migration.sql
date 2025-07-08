/*
  Warnings:

  - The values [yearly] on the enum `SubType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubType_new" AS ENUM ('monthly', 'quaterly', 'trial');
ALTER TABLE "Subscription" ALTER COLUMN "subType" TYPE "SubType_new" USING ("subType"::text::"SubType_new");
ALTER TYPE "SubType" RENAME TO "SubType_old";
ALTER TYPE "SubType_new" RENAME TO "SubType";
DROP TYPE "SubType_old";
COMMIT;
