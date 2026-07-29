import { AlertSeverity, AlertType } from '@prisma/client';
import { prisma } from '../config/database';
import { WsBroadcaster } from '../websocket/broadcast';

type ReadingLike = {
  aqi: number;
  pm25?: number | null;
  batteryPercent?: number | null;
};

type FilterLike = {
  hepaPercent: number;
  prefilterPercent: number;
} | null;

const DEDUPE_WINDOW_MS = 30 * 60 * 1000;

async function createIfNew(params: {
  type: AlertType;
  severity: AlertSeverity;
  deviceId: string;
  zoneId: string;
  message: string;
}) {
  const recent = await prisma.alert.findFirst({
    where: {
      type: params.type,
      deviceId: params.deviceId,
      resolvedAt: null,
      createdAt: { gte: new Date(Date.now() - DEDUPE_WINDOW_MS) },
    },
  });
  if (recent) return;

  const alert = await prisma.alert.create({
    data: {
      type: params.type,
      severity: params.severity,
      deviceId: params.deviceId,
      zoneId: params.zoneId,
      message: params.message,
    },
  });

  WsBroadcaster.broadcast('alerts', 'alert', alert);
}

export async function evaluateTelemetryAlerts(input: {
  deviceId: string;
  zoneId: string;
  readings: ReadingLike;
  filters?: FilterLike;
}) {
  const { deviceId, zoneId, readings, filters } = input;

  if (readings.aqi >= 150) {
    await createIfNew({
      type: 'HIGH_POLLUTION',
      severity: readings.aqi >= 200 ? 'CRITICAL' : 'WARNING',
      deviceId,
      zoneId,
      message: `High pollution detected on ${deviceId}: AQI ${readings.aqi}`,
    });
  }

  if (filters && filters.hepaPercent <= 20) {
    await createIfNew({
      type: 'HEPA_LOW',
      severity: filters.hepaPercent <= 10 ? 'CRITICAL' : 'WARNING',
      deviceId,
      zoneId,
      message: `HEPA filter low on ${deviceId}: ${filters.hepaPercent}%`,
    });
  }

  if (filters && filters.prefilterPercent <= 15) {
    await createIfNew({
      type: 'PREFILTER_CRITICAL',
      severity: 'CRITICAL',
      deviceId,
      zoneId,
      message: `Prefilter critical on ${deviceId}: ${filters.prefilterPercent}%`,
    });
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    select: { batteryPercent: true },
  });
  if (device?.batteryPercent != null && device.batteryPercent <= 20) {
    await createIfNew({
      type: 'BATTERY_LOW',
      severity: device.batteryPercent <= 10 ? 'CRITICAL' : 'WARNING',
      deviceId,
      zoneId,
      message: `Battery low on ${deviceId}: ${device.batteryPercent}%`,
    });
  }
}
