UPDATE "Order"
SET "status" = 'AWAITING_COMMUNICATION_LINK'
WHERE "status" = 'NEW'
  AND "serviceType" = 'LIVE_CALL'
  AND "communicationLink" IS NULL;

UPDATE "Order"
SET "status" = 'COMMUNICATION_LINK_ADDED'
WHERE "status" IN ('NEW', 'AWAITING_COMMUNICATION_LINK')
  AND "serviceType" = 'LIVE_CALL'
  AND "communicationLink" IS NOT NULL;
