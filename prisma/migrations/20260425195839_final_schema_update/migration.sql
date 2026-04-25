/*
  Warnings:

  - A unique constraint covering the columns `[leaderId]` on the table `team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `course` ADD COLUMN `certTemplate` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `team` ADD COLUMN `leaderId` INTEGER NULL,
    MODIFY `region` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `nationalId` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `region` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SupportTicket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `senderName` VARCHAR(255) NOT NULL,
    `senderEmail` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `reply` TEXT NULL,
    `repliedBy` VARCHAR(255) NULL,
    `repliedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `team_leaderId_key` ON `team`(`leaderId`);
