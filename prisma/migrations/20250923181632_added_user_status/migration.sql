-- CreateEnum
CREATE TYPE "public"."UserStatus" AS ENUM ('SIGNED', 'NOT_SIGNED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "status" "public"."UserStatus" NOT NULL DEFAULT 'NOT_SIGNED';
