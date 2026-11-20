-- CreateEnum
CREATE TYPE "Level" AS ENUM ('sodda', 'orta', 'murakkab');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('image', 'video', 'link');

-- CreateEnum
CREATE TYPE "ResourceKind" AS ENUM ('image', 'video', 'music');

-- CreateTable
CREATE TABLE "Month" (
    "id" SERIAL NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Month_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "monthId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "level" "Level" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" "ItemType" NOT NULL,
    "src" TEXT,
    "view" TEXT,
    "poster" TEXT,
    "url" TEXT,
    "w" INTEGER,
    "h" INTEGER,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "kind" "ResourceKind" NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "src" TEXT NOT NULL,
    "view" TEXT,
    "thumb" TEXT,
    "poster" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_number_key" ON "Lesson"("number");

-- CreateIndex
CREATE INDEX "Lesson_monthId_idx" ON "Lesson"("monthId");

-- CreateIndex
CREATE INDEX "Item_lessonId_idx" ON "Item"("lessonId");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
