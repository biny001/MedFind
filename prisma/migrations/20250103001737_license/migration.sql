/*
  Warnings:

  - Added the required column `ownerLicence` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pharmacy" ADD COLUMN     "ownerLicence" TEXT NOT NULL,
ADD COLUMN     "pharmacyImage" TEXT[],
ADD COLUMN     "pharmacyLicence" TEXT[];
