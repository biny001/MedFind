/*
  Warnings:

  - You are about to drop the column `contactInfo` on the `Pharmacy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Pharmacy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Pharmacy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pharmacy" DROP COLUMN "contactInfo",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pharmacy_email_key" ON "Pharmacy"("email");
