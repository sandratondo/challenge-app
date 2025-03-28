-- DropForeignKey
ALTER TABLE `passwordresettoken` DROP FOREIGN KEY `PasswordResetToken_userId_fkey`;

-- DropIndex
DROP INDEX `PasswordResetToken_token_idx` ON `passwordresettoken`;

-- DropIndex
DROP INDEX `PasswordResetToken_userId_idx` ON `passwordresettoken`;

-- AddForeignKey
ALTER TABLE `PasswordResetToken` ADD CONSTRAINT `PasswordResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
