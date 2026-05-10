CREATE TABLE "OrderMessage" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "authorId" TEXT,
    "senderRole" "Role" NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "OrderMessage_orderId_createdAt_idx" ON "OrderMessage"("orderId", "createdAt");
CREATE INDEX "OrderMessage_authorId_idx" ON "OrderMessage"("authorId");

ALTER TABLE "OrderMessage"
ADD CONSTRAINT "OrderMessage_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "OrderMessage"
ADD CONSTRAINT "OrderMessage_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "OrderMessage" ("id", "orderId", "authorId", "senderRole", "body", "createdAt")
SELECT CONCAT('legacy-question-', "id"), "id", "userId", 'user'::"Role", "customerQuestion", "updatedAt"
FROM "Order"
WHERE "customerQuestion" IS NOT NULL AND LENGTH(TRIM("customerQuestion")) > 0;
