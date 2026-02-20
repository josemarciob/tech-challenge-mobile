/*
  Warnings:

  - You are about to drop the column `atividadesConcluidas` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `farmLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `moedas` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nivel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_postId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "atividadesConcluidas",
DROP COLUMN "farmLevel",
DROP COLUMN "moedas",
DROP COLUMN "nivel",
ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedActivities" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ALTER COLUMN "maxStorage" SET DEFAULT 30;

-- DropTable
DROP TABLE "Comment";

-- DropTable
DROP TABLE "Like";
