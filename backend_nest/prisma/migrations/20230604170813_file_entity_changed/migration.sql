-- AlterTable
ALTER TABLE "file_store" ALTER COLUMN "file_location" DROP NOT NULL,
ALTER COLUMN "ext" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
