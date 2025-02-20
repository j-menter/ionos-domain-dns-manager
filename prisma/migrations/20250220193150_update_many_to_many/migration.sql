/*
  Warnings:

  - You are about to drop the column `userId` on the `domain` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `domain` DROP FOREIGN KEY `Domain_userId_fkey`;

-- DropIndex
DROP INDEX `Domain_userId_fkey` ON `domain`;

-- AlterTable
ALTER TABLE `domain` DROP COLUMN `userId`;

-- CreateTable
CREATE TABLE `_UserDomains` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserDomains_AB_unique`(`A`, `B`),
    INDEX `_UserDomains_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_UserDomains` ADD CONSTRAINT `_UserDomains_A_fkey` FOREIGN KEY (`A`) REFERENCES `Domain`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserDomains` ADD CONSTRAINT `_UserDomains_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
