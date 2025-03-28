-- DropForeignKey
ALTER TABLE `passwordresettoken` DROP FOREIGN KEY `PasswordResetToken_userId_fkey`;

-- DropIndex
DROP INDEX `PasswordResetToken_userId_fkey` ON `passwordresettoken`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpiry` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
