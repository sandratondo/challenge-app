-- RedefineIndex
CREATE INDEX `PasswordResetToken_userId_idx` ON `PasswordResetToken`(`userId`);
DROP INDEX `PasswordResetToken_userId_fkey` ON `passwordresettoken`;
