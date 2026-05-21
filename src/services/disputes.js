import { getStore, setStore, generateId } from './storage';
import { logAudit } from './audit';

export const DISPUTE_TYPES = ['Billing Dispute', 'Incorrect Charge', 'Service Query', 'Meter Reading Dispute'];
export const DISPUTE_STATUSES = ['Submitted', 'Under Review', 'Resolved', 'Rejected'];

export function getDisputes(userId = null) {
  const all = getStore('disputes', []);
  return userId ? all.filter((d) => d.userId === userId) : all;
}

export function getDispute(id) {
  return getDisputes().find((d) => d.id === id);
}

export function createDispute(data) {
  const disputes = getDisputes();
  const dispute = {
    id: generateId('DSP'),
    reference: `DSP-${Date.now().toString(36).toUpperCase()}`,
    userId: data.userId,
    type: data.type,
    subject: data.subject,
    description: data.description,
    accountNumber: data.accountNumber,
    status: 'Submitted',
    createdAt: new Date().toISOString(),
    updates: [{ status: 'Submitted', message: 'Your dispute has been received.', date: new Date().toISOString() }],
  };
  disputes.unshift(dispute);
  setStore('disputes', disputes);
  logAudit('dispute_submitted', { reference: dispute.reference }, data.userId);
  return dispute;
}

export function updateDisputeStatus(id, status, message, staffId) {
  const disputes = getDisputes();
  const idx = disputes.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  disputes[idx].status = status;
  disputes[idx].updates.push({ status, message, date: new Date().toISOString(), by: staffId });
  setStore('disputes', disputes);
  logAudit('dispute_updated', { reference: disputes[idx].reference, status }, staffId);
  return disputes[idx];
}
