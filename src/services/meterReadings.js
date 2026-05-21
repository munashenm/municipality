import { getStore, setStore, generateId } from './storage';
import { logAudit } from './audit';

export function getMeterReadings(userId = null) {
  const all = getStore('meterReadings', []);
  return userId ? all.filter((m) => m.userId === userId) : all;
}

export function submitMeterReading(data) {
  const readings = getMeterReadings();
  const reading = {
    id: generateId('MR'),
    userId: data.userId,
    accountNumber: data.accountNumber,
    meterType: data.meterType,
    reading: data.reading,
    photo: data.photo || null,
    submittedAt: new Date().toISOString(),
    status: 'Received',
  };
  readings.unshift(reading);
  setStore('meterReadings', readings);
  logAudit('meter_reading_submitted', { meterType: data.meterType, reading: data.reading }, data.userId);
  return reading;
}
