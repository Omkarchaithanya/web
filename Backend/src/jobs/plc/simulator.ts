import { logger } from '../../utils/logger';

/**
 * Fallback data generator producing realistic values for local development/simulation
 */
export class PLCSimulator {
  static getSensorReadings() {
    const aqi = Math.floor(Math.random() * 50) + 10;
    return {
      aqi,
      pm1: aqi * 0.2,
      pm25: aqi * 0.5,
      pm10: aqi * 0.8,
      co2: Math.floor(Math.random() * 200) + 400,
      voc: Math.random() * 2,
      temp: 24 + Math.random() * 5,
      humidity: 40 + Math.random() * 20,
    };
  }

  static getFilterStatus() {
    return {
      hepaPercent: Math.floor(Math.random() * 10) + 90,
      carbonPercent: Math.floor(Math.random() * 10) + 80,
      prefilterPercent: Math.floor(Math.random() * 20) + 70,
      uvLight: true,
      ionizer: true,
      mossChamber: true,
      cycloneSeparator: true,
    };
  }
}
