-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'GOVT_ADMIN', 'TECHNICIAN');

-- CreateEnum
CREATE TYPE "DeviceStatus" AS ENUM ('ONLINE', 'OFFLINE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "PowerSource" AS ENUM ('SOLAR', 'GRID', 'BATTERY');

-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('PREFILTER_CRITICAL', 'DEVICE_OFFLINE', 'HIGH_POLLUTION', 'HEPA_LOW', 'BATTERY_LOW', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('INFO', 'WARNING', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DeviceCommandType" AS ENUM ('RESTART', 'BOOST', 'FORCE_SYNC', 'EMERGENCY_MODE', 'FAN_SPEED');

-- CreateEnum
CREATE TYPE "DeviceCommandStatus" AS ENUM ('PENDING', 'SENT', 'ACKNOWLEDGED', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'TECHNICIAN',
    "region" TEXT NOT NULL DEFAULT 'ap-south-1',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "user_agent" TEXT,
    "ip_address" TEXT,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Bengaluru',
    "before_aqi" INTEGER NOT NULL,
    "after_aqi" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" TEXT NOT NULL,
    "zone_id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "DeviceStatus" NOT NULL DEFAULT 'OFFLINE',
    "firmware" TEXT NOT NULL DEFAULT 'v3.1.4',
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "power_source" "PowerSource" NOT NULL DEFAULT 'SOLAR',
    "solar_percent" INTEGER,
    "battery_percent" INTEGER,
    "coverage_radius" INTEGER NOT NULL DEFAULT 250,
    "fan_speed" INTEGER NOT NULL DEFAULT 80,
    "air_intake" INTEGER NOT NULL DEFAULT 75,
    "purification_efficiency" INTEGER NOT NULL DEFAULT 92,
    "uptime_percent" DOUBLE PRECISION NOT NULL DEFAULT 99.0,
    "last_sync_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sensor_readings" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "aqi" INTEGER NOT NULL,
    "pm1" DOUBLE PRECISION,
    "pm25" DOUBLE PRECISION,
    "pm10" DOUBLE PRECISION,
    "co2" INTEGER,
    "voc" DOUBLE PRECISION,
    "temp" DOUBLE PRECISION,
    "humidity" DOUBLE PRECISION,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sensor_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filter_status" (
    "id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "hepa_percent" INTEGER NOT NULL,
    "carbon_percent" INTEGER NOT NULL,
    "prefilter_percent" INTEGER NOT NULL,
    "uv_light" BOOLEAN NOT NULL DEFAULT true,
    "ionizer" BOOLEAN NOT NULL DEFAULT true,
    "moss_chamber" BOOLEAN NOT NULL DEFAULT true,
    "cyclone_separator" BOOLEAN NOT NULL DEFAULT true,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "filter_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'WARNING',
    "device_id" TEXT,
    "zone_id" TEXT,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_insights" (
    "id" TEXT NOT NULL,
    "zone_id" TEXT,
    "device_id" TEXT,
    "message" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "model_version" TEXT NOT NULL,
    "predicted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enquiries" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mobile" TEXT,
    "purpose" TEXT,
    "description" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_commands" (
    "id" TEXT NOT NULL,
    "device_id" TEXT,
    "command_type" "DeviceCommandType" NOT NULL,
    "payload" JSONB,
    "status" "DeviceCommandStatus" NOT NULL DEFAULT 'PENDING',
    "issued_by" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_message" TEXT,

    CONSTRAINT "device_commands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resource_id" TEXT,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "zones_slug_key" ON "zones"("slug");

-- CreateIndex
CREATE INDEX "zones_city_idx" ON "zones"("city");

-- CreateIndex
CREATE INDEX "devices_zone_id_idx" ON "devices"("zone_id");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE INDEX "sensor_readings_device_id_recorded_at_idx" ON "sensor_readings"("device_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "sensor_readings_recorded_at_idx" ON "sensor_readings"("recorded_at" DESC);

-- CreateIndex
CREATE INDEX "filter_status_device_id_recorded_at_idx" ON "filter_status"("device_id", "recorded_at" DESC);

-- CreateIndex
CREATE INDEX "alerts_is_read_created_at_idx" ON "alerts"("is_read", "created_at" DESC);

-- CreateIndex
CREATE INDEX "alerts_device_id_idx" ON "alerts"("device_id");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "ai_insights_predicted_at_idx" ON "ai_insights"("predicted_at" DESC);

-- CreateIndex
CREATE INDEX "enquiries_status_created_at_idx" ON "enquiries"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "enquiries_email_idx" ON "enquiries"("email");

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "device_commands_status_issued_at_idx" ON "device_commands"("status", "issued_at" DESC);

-- CreateIndex
CREATE INDEX "device_commands_device_id_idx" ON "device_commands"("device_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filter_status" ADD CONSTRAINT "filter_status_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_insights" ADD CONSTRAINT "ai_insights_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_commands" ADD CONSTRAINT "device_commands_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_commands" ADD CONSTRAINT "device_commands_issued_by_fkey" FOREIGN KEY ("issued_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
