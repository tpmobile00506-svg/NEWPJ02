-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."approvals" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "decision" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."asset_groups" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "asset_groups_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."assets" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitSatang" BIGINT NOT NULL,
    "totalSatang" BIGINT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,
    "condition" TEXT NOT NULL DEFAULT 'normal',
    "lifecycle" TEXT NOT NULL DEFAULT 'active',
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "sourceId" TEXT,
    "sourceRow" TEXT,
    "receivedDate" TEXT NOT NULL DEFAULT '',
    "lifeYears" INTEGER NOT NULL DEFAULT 0,
    "salvageSatang" BIGINT NOT NULL DEFAULT 0,
    "serial" TEXT NOT NULL DEFAULT '',
    "brand" TEXT NOT NULL DEFAULT '',
    "custodian" TEXT NOT NULL DEFAULT '',
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit" (
    "id" TEXT NOT NULL,
    "assetId" TEXT,
    "actor" TEXT NOT NULL,
    "actorName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "before" TEXT NOT NULL,
    "after" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_sessions" (
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_sessions_pkey" PRIMARY KEY ("tokenHash")
);

-- CreateTable
CREATE TABLE "public"."branches" (
    "name" TEXT NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "name" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."imports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "rowCount" INTEGER NOT NULL,
    "createdAt" TEXT NOT NULL,
    "actor" TEXT NOT NULL,

    CONSTRAINT "imports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."invites" (
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("email")
);

-- CreateTable
CREATE TABLE "public"."locations" (
    "name" TEXT NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."login_attempts" (
    "key" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."operations" (
    "id" TEXT NOT NULL,
    "valid" INTEGER NOT NULL DEFAULT 1,
    "actor" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL DEFAULT '',
    "response" TEXT NOT NULL DEFAULT '{}',

    CONSTRAINT "operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."requests" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assetVersion" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "stage" INTEGER NOT NULL DEFAULT 0,
    "chain" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "version" INTEGER NOT NULL DEFAULT 1,
    "actor" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."settings" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."source_rows" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "sourceRow" TEXT NOT NULL,
    "raw" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "source_rows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stocktake_items" (
    "id" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "snapshot" TEXT NOT NULL,
    "result" TEXT NOT NULL DEFAULT 'pending',
    "quantity" INTEGER,
    "notes" TEXT NOT NULL DEFAULT '',
    "actor" TEXT,
    "checkedAt" TEXT,

    CONSTRAINT "stocktake_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stocktakes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TEXT NOT NULL,
    "closedAt" TEXT,

    CONSTRAINT "stocktakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."stored_files" (
    "key" TEXT NOT NULL,
    "body" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_files_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" INTEGER NOT NULL DEFAULT 1,
    "passwordHash" TEXT NOT NULL DEFAULT '',
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "approval_stage_once" ON "public"."approvals"("requestId" ASC, "stage" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "asset_code_unique" ON "public"."assets"("code" ASC);

-- CreateIndex
CREATE INDEX "asset_lifecycle_branch" ON "public"."assets"("lifecycle" ASC, "branch" ASC);

-- CreateIndex
CREATE INDEX "asset_parent" ON "public"."assets"("parentId" ASC);

-- CreateIndex
CREATE INDEX "audit_asset" ON "public"."audit"("assetId" ASC, "createdAt" ASC);

-- CreateIndex
CREATE INDEX "auth_sessions_expiresAt_idx" ON "public"."auth_sessions"("expiresAt" ASC);

-- CreateIndex
CREATE INDEX "auth_sessions_userId_idx" ON "public"."auth_sessions"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "imports_hash" ON "public"."imports"("hash" ASC);

-- CreateIndex
CREATE INDEX "request_status" ON "public"."requests"("status" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "source_row_once" ON "public"."source_rows"("sourceId" ASC, "sourceRow" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "stocktake_asset_once" ON "public"."stocktake_items"("roundId" ASC, "assetId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email" ON "public"."users"("email" ASC);

-- AddForeignKey
ALTER TABLE "public"."approvals" ADD CONSTRAINT "approvals_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "public"."requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_branch_fkey" FOREIGN KEY ("branch") REFERENCES "public"."branches"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_category_fkey" FOREIGN KEY ("category") REFERENCES "public"."categories"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_groupName_fkey" FOREIGN KEY ("groupName") REFERENCES "public"."asset_groups"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."assets" ADD CONSTRAINT "assets_location_fkey" FOREIGN KEY ("location") REFERENCES "public"."locations"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auth_sessions" ADD CONSTRAINT "auth_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."requests" ADD CONSTRAINT "requests_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stocktake_items" ADD CONSTRAINT "stocktake_items_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."assets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."stocktake_items" ADD CONSTRAINT "stocktake_items_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."stocktakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
