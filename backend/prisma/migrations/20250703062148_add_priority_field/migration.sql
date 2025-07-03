-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'medium',
ALTER COLUMN "status" DROP DEFAULT;
