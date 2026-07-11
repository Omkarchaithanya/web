export function getAqiLabel(aqi: number): string {
  if (aqi <= 50) return 'GOOD';
  if (aqi <= 100) return 'MODERATE';
  if (aqi <= 150) return 'UNHEALTHY FOR SOME';
  if (aqi <= 200) return 'UNHEALTHY';
  if (aqi <= 300) return 'VERY UNHEALTHY';
  return 'HAZARDOUS';
}

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e';
  if (aqi <= 100) return '#eab308';
  if (aqi <= 150) return '#f97316';
  if (aqi <= 200) return '#ef4444';
  return '#a855f7';
}

export function calculateRoiPercent(before: number, after: number): number {
  if (before === 0) return 0;
  return Math.round(((after - before) / before) * 100);
}

export function formatPowerDisplay(
  powerSource: string,
  solarPercent?: number | null,
  batteryPercent?: number | null,
): string {
  switch (powerSource) {
    case 'SOLAR':
      return solarPercent != null ? `Solar ${solarPercent}%` : 'Solar';
    case 'BATTERY':
      return batteryPercent != null ? `Bat ${batteryPercent}%` : 'Battery';
    case 'GRID':
      return 'Grid';
    default:
      return powerSource;
  }
}

export function formatUptime(status: string, uptimePercent: number): string {
  if (status === 'OFFLINE') return 'Offline';
  return `${uptimePercent.toFixed(1)}%`;
}

export function formatTemp(temp?: number | null): string | null {
  if (temp == null) return null;
  return `${Math.round(temp)}°C`;
}
