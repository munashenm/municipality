import { getStore, setStore, generateId, generateTicketNumber } from './storage';

export const ISSUE_TYPES = [
  'Water Leak',
  'Pothole',
  'Electricity Outage',
  'Illegal Dumping',
  'Sewer Issue',
  'Broken Street Light',
];

export const REPORT_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export function getReports() {
  return getStore('reports', []);
}

export function getReportByTicket(ticketNumber) {
  return getReports().find((r) => r.ticketNumber.toLowerCase() === ticketNumber.toLowerCase());
}

export function getReportById(id) {
  return getReports().find((r) => r.id === id);
}

export function createReport(data) {
  const reports = getReports();
  const report = {
    id: generateId('RPT'),
    ticketNumber: generateTicketNumber(),
    type: data.type,
    description: data.description,
    location: data.location,
    gps: data.gps || null,
    status: 'Open',
    photos: data.photos || [],
    createdAt: new Date().toISOString(),
    updates: [{ status: 'Open', message: 'Report received. A technician will be assigned.', date: new Date().toISOString() }],
    reporterName: data.reporterName,
    reporterPhone: data.reporterPhone,
    reporterEmail: data.reporterEmail || '',
  };
  reports.unshift(report);
  setStore('reports', reports);
  return report;
}

export function updateReportStatus(id, status, message) {
  const reports = getReports();
  const idx = reports.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  reports[idx].status = status;
  reports[idx].updates.push({ status, message: message || `Status updated to ${status}`, date: new Date().toISOString() });
  setStore('reports', reports);
  return reports[idx];
}
