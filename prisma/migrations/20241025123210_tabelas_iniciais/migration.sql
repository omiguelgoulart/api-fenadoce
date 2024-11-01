-- CreateTable
CREATE TABLE `candidatas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,
    `clube` VARCHAR(30) NOT NULL,
    `idade` SMALLINT NOT NULL,
    `sonho` VARCHAR(191) NOT NULL,
    `numVotos` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(30) NOT NULL,
    `email` VARCHAR(60) NOT NULL,
    `cidade` VARCHAR(20) NOT NULL,
    `dataNasc` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `votos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `candidataId` INTEGER NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `justificativa` VARCHAR(100) NULL,
    `data` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `votos` ADD CONSTRAINT `votos_candidataId_fkey` FOREIGN KEY (`candidataId`) REFERENCES `candidatas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `votos` ADD CONSTRAINT `votos_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
