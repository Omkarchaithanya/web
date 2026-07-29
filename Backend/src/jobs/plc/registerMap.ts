export const registerMap = {
  // Set REGISTER_MAP_CONFIRMED=true in env only after vendor verification.
  // Placeholder addresses for Delta DVP-12SA2 PLC Modbus RTU — do not use live without confirmation.
  AQI: 0x1000,
  PM1: 0x1001,
  PM25: 0x1002,
  PM10: 0x1003,
  CO2: 0x1004,
  VOC: 0x1005,
  TEMP: 0x1006,
  HUMIDITY: 0x1007,

  HEPA_PERCENT: 0x1010,
  CARBON_PERCENT: 0x1011,
  PREFILTER_PERCENT: 0x1012,

  UV_LIGHT_COIL: 0x0800,
  IONIZER_COIL: 0x0801,
  MOSS_CHAMBER_COIL: 0x0802,
  CYCLONE_SEPARATOR_COIL: 0x0803,
};
