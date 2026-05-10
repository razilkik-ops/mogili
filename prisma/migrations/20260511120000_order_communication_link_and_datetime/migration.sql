-- Rename old enum so we can create the new one with updated values.
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

CREATE TYPE "OrderStatus" AS ENUM (
    'NEW',
    'AWAITING_COMMUNICATION_LINK',
    'COMMUNICATION_LINK_ADDED',
    'SCHEDULED',
    'IN_PROGRESS',
    'REPORT_UPLOADED',
    'COMPLETED',
    'CANCELED'
);

-- Add the new fields in a backward-compatible way, then backfill them from the legacy columns.
ALTER TABLE "Order"
ADD COLUMN "preferredDateTime" TIMESTAMP(3),
ADD COLUMN "communicationLink" TEXT;

UPDATE "Order"
SET
    "preferredDateTime" = "preferredDate",
    "communicationLink" = COALESCE("zoomLink", "telegramLink");

ALTER TABLE "Order"
ALTER COLUMN "preferredDateTime" SET NOT NULL;

-- Move existing enum values to the new enum. Legacy ACCEPTED orders become "awaiting link".
ALTER TABLE "Order"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" TYPE "OrderStatus"
USING (
    CASE
        WHEN "status"::text = 'ACCEPTED' THEN 'AWAITING_COMMUNICATION_LINK'
        ELSE "status"::text
    END
)::"OrderStatus",
ALTER COLUMN "status" SET DEFAULT 'NEW';

DROP TYPE "OrderStatus_old";

ALTER TABLE "Order"
DROP COLUMN "preferredDate",
DROP COLUMN "zoomLink",
DROP COLUMN "telegramLink";
