import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';
import { asyncHandler, successResponse } from '../utils/http';
import { validate } from '../middleware/validate';
import { iotApiKeyAuth } from '../middleware/auth';
import { iotRateLimiter } from '../middleware/rateLimiter';
import { evaluateTelemetryAlerts } from '../services/telemetry-alert.service';
import { WsBroadcaster } from '../websocket/broadcast';

const telemetrySchema = z.object({
  body: z.object({
    deviceId: z.string().min(1),
    aqi: z.number().int(),
    pm1: z.number().optional(),
    pm25: z.number().optional(),
    pm10: z.number().optional(),
    co2: z.number().int().optional(),
    voc: z.number().optional(),
    temp: z.number().optional(),
    humidity: z.number().optional(),
    filters: z
      .object({
        hepaPercent: z.number().int().min(0).max(100),
        carbonPercent: z.number().int().min(0).max(100),
        prefilterPercent: z.number().int().min(0).max(100),
        uvLight: z.boolean().optional(),
        ionizer: z.boolean().optional(),
        mossChamber: z.boolean().optional(),
        cycloneSeparator: z.boolean().optional(),
      })
      .optional(),
  }),
  query: z.object({}),
  params: z.object({}),
});

const router = Router();

/**
 * @openapi
 * /iot/telemetry:
 *   post:
 *     summary: Ingest device telemetry via IoT API key
 *     tags: [IoT]
 *     security: []
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Telemetry stored
 */
router.post(
  '/telemetry',
  iotRateLimiter,
  iotApiKeyAuth,
  validate(telemetrySchema),
  asyncHandler(async (req, res) => {
    const { deviceId, filters, ...readings } = req.body;

    const device = await prisma.device.findUnique({ where: { id: deviceId } });
    if (!device) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Device not found' } });
      return;
    }

    const readingRecord = await prisma.sensorReading.create({
      data: { deviceId, ...readings },
    });

    let filterRecord = null;
    if (filters) {
      filterRecord = await prisma.filterStatus.create({
        data: { deviceId, ...filters },
      });
    }

    await prisma.device.update({
      where: { id: deviceId },
      data: { lastSyncAt: new Date(), status: 'ONLINE' },
    });

    await evaluateTelemetryAlerts({
      deviceId,
      zoneId: device.zoneId,
      readings: readingRecord,
      filters: filterRecord,
    });

    WsBroadcaster.broadcast(`device:${deviceId}`, 'telemetry', {
      readings: readingRecord,
      filters: filterRecord,
    });

    successResponse(res, { reading: readingRecord, filters: filterRecord }, 201);
  }),
);

export default router;
