-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "divlog_name" VARCHAR(20) NOT NULL,
    "license_name" VARCHAR(75),
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(150) NOT NULL,
    "certification" VARCHAR(75),
    "cert_org_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diver_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "norecord_dive_count" INTEGER,
    "height" DOUBLE PRECISION,
    "weight" DOUBLE PRECISION,
    "shoe" DOUBLE PRECISION,
    "measurement_unit" INTEGER,
    "languages" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diver_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_centers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(75) NOT NULL,
    "country_id" INTEGER NOT NULL,
    "organization_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(75) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "center_staffs" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "dive_center_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "center_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_purposes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(75) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(75) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_records" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "log_no" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "location" VARCHAR(150),
    "country_id" INTEGER,
    "purpose_id" INTEGER,
    "course" VARCHAR(150),
    "weather" VARCHAR(75),
    "surface_temperature" INTEGER,
    "water_temperature" INTEGER,
    "max_depth" INTEGER,
    "visibility" INTEGER,
    "start_time" TIMESTAMP,
    "end_time" TIMESTAMP,
    "tankpressure_start" INTEGER,
    "tankpressure_end" INTEGER,
    "added_weight" INTEGER,
    "suit" VARCHAR(75),
    "gears" VARCHAR(255),
    "buddy_str" VARCHAR(75),
    "buddy_ref" UUID,
    "supervisor_str" VARCHAR(75),
    "supervisor_ref" UUID,
    "dive_center_str" VARCHAR(75),
    "dive_center_id" UUID,
    "notes" VARCHAR,
    "is_draft" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follow" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "following_user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dive_center_follow" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "following_dc_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dive_center_follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_divlog_name_key" ON "users"("divlog_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_divlog_name_email_key" ON "users"("divlog_name", "email");

-- CreateIndex
CREATE UNIQUE INDEX "diver_info_user_id_key" ON "diver_info"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dive_centers_name_key" ON "dive_centers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "dive_centers_name_country_id_key" ON "dive_centers"("name", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_name_key" ON "organizations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "center_staffs_user_id_dive_center_id_key" ON "center_staffs"("user_id", "dive_center_id");

-- CreateIndex
CREATE UNIQUE INDEX "dive_purposes_name_key" ON "dive_purposes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_follow_user_id_following_user_id_key" ON "user_follow"("user_id", "following_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dive_center_follow_user_id_following_dc_id_key" ON "dive_center_follow"("user_id", "following_dc_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cert_org_id_fkey" FOREIGN KEY ("cert_org_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diver_info" ADD CONSTRAINT "diver_info_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_centers" ADD CONSTRAINT "dive_centers_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_centers" ADD CONSTRAINT "dive_centers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_staffs" ADD CONSTRAINT "center_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "center_staffs" ADD CONSTRAINT "center_staffs_dive_center_id_fkey" FOREIGN KEY ("dive_center_id") REFERENCES "dive_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_records" ADD CONSTRAINT "dive_records_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_records" ADD CONSTRAINT "dive_records_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_records" ADD CONSTRAINT "dive_records_purpose_id_fkey" FOREIGN KEY ("purpose_id") REFERENCES "dive_purposes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_records" ADD CONSTRAINT "dive_records_buddy_ref_fkey" FOREIGN KEY ("buddy_ref") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_records" ADD CONSTRAINT "dive_records_supervisor_ref_fkey" FOREIGN KEY ("supervisor_ref") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_records" ADD CONSTRAINT "dive_records_dive_center_id_fkey" FOREIGN KEY ("dive_center_id") REFERENCES "dive_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follow" ADD CONSTRAINT "user_follow_following_user_id_fkey" FOREIGN KEY ("following_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_center_follow" ADD CONSTRAINT "dive_center_follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dive_center_follow" ADD CONSTRAINT "dive_center_follow_following_dc_id_fkey" FOREIGN KEY ("following_dc_id") REFERENCES "dive_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
