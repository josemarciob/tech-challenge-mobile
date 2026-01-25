/*
  Warnings:

  - Added the required column `postId` to the `Atividade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Atividade" ADD COLUMN     "postId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Questao" (
    "id" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "resposta" TEXT NOT NULL,
    "atividadeId" INTEGER NOT NULL,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Atividade" ADD CONSTRAINT "Atividade_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questao" ADD CONSTRAINT "Questao_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "Atividade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
