-- Enforce application invariants in PostgreSQL without rewriting or deleting data.
ALTER TABLE "assets" ADD CONSTRAINT "positive_quantity" CHECK ("quantity" BETWEEN 1 AND 1000000);
ALTER TABLE "assets" ADD CONSTRAINT "nonnegative_money" CHECK ("unitSatang" BETWEEN 0 AND 100000000000000 AND "totalSatang" BETWEEN 0 AND 100000000000000 AND "salvageSatang" BETWEEN 0 AND "totalSatang");
ALTER TABLE "assets" ADD CONSTRAINT "valid_asset_state" CHECK ("condition" IN ('normal','damaged','repair','missing') AND "lifecycle" IN ('active','split','disposed') AND "version" > 0);
ALTER TABLE "users" ADD CONSTRAINT "valid_role" CHECK ("role" IN ('staff','head','deputy','dean','admin') AND "active" IN (0,1));
ALTER TABLE "operations" ADD CONSTRAINT "operation_assertion" CHECK ("valid" = 1);
CREATE UNIQUE INDEX "one_pending_request_per_asset" ON "requests" ("assetId") WHERE "status" = 'pending';
