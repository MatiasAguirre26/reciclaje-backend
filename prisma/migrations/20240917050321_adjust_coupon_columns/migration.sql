/*
  Warnings:

  - You are about to drop the column `benefitsId` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `coupon` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "coupon" DROP CONSTRAINT "coupon_benefitsId_fkey";

-- DropForeignKey
ALTER TABLE "coupon" DROP CONSTRAINT "coupon_userId_fkey";

-- AlterTable
ALTER TABLE "coupon" DROP COLUMN "benefitsId",
DROP COLUMN "userId",
ADD COLUMN     "benefits_id" BIGINT,
ADD COLUMN     "user_id" BIGINT;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupon" ADD CONSTRAINT "coupon_benefits_id_fkey" FOREIGN KEY ("benefits_id") REFERENCES "benefits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
