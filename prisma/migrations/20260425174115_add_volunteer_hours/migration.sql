/*
  Warnings:

  - You are about to drop the column `leaderId` on the `team` table. All the data in the column will be lost.
  - The primary key for the `trainer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email]` on the table `team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leader_name` to the `team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nationalId` to the `team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `course` DROP FOREIGN KEY `Course_trainerId_fkey`;

-- DropForeignKey
ALTER TABLE `team` DROP FOREIGN KEY `team_leaderId_fkey`;

-- DropIndex
DROP INDEX `team_leaderId_key` ON `team`;

-- DropIndex
DROP INDEX `Trainer_email_key` ON `trainer`;

-- AlterTable
ALTER TABLE `course` ADD COLUMN `durationHours` INTEGER NULL,
    ADD COLUMN `image` VARCHAR(191) NULL,
    ADD COLUMN `instructorName` VARCHAR(191) NULL,
    ADD COLUMN `volunteerHours` INTEGER NOT NULL DEFAULT 0,
    MODIFY `trainerId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `team` DROP COLUMN `leaderId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `job` VARCHAR(191) NULL,
    ADD COLUMN `leader_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `nationalId` VARCHAR(191) NOT NULL,
    ADD COLUMN `organization` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `trainer` DROP PRIMARY KEY,
    ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `specialty` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `team_email_key` ON `team`(`email`);

-- AddForeignKey
ALTER TABLE `Course` ADD CONSTRAINT `Course_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RedefineIndex
CREATE UNIQUE INDEX `email` ON `admin`(`email`);
DROP INDEX `admin_email_key` ON `admin`;

-- RedefineIndex
CREATE UNIQUE INDEX `username` ON `admin`(`username`);
DROP INDEX `admin_username_key` ON `admin`;
