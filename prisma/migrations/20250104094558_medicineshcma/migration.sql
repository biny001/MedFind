/*
  Warnings:

  - Added the required column `administrationRoute` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doseAmount` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `doseUnit` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `form` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storage` to the `Medicine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier` to the `Medicine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "administrationRoute" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "doseAmount" TEXT NOT NULL,
ADD COLUMN     "doseUnit" TEXT NOT NULL,
ADD COLUMN     "form" TEXT NOT NULL,
ADD COLUMN     "medicineImage" TEXT[],
ADD COLUMN     "storage" TEXT NOT NULL,
ADD COLUMN     "supplier" TEXT NOT NULL;
