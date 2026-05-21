import { getStore, setStore, generateId } from './storage';
import { logAudit } from './audit';

export function getProofRequests(userId = null) {
  const all = getStore('proofRequests', []);
  return userId ? all.filter((p) => p.userId === userId) : all;
}

export function createProofRequest(userId, accountNumber) {
  const requests = getProofRequests();
  const existing = requests.find((p) => p.userId === userId && p.status === 'Pending');
  if (existing) return { success: false, error: 'You already have a pending request', request: existing };

  const request = {
    id: generateId('POR'),
    userId,
    accountNumber,
    status: 'Pending',
    documentRef: null,
    requestedAt: new Date().toISOString(),
  };
  requests.unshift(request);
  setStore('proofRequests', requests);
  logAudit('proof_of_residence_requested', { accountNumber }, userId);
  return { success: true, request };
}

export function approveProofRequest(id, staffId) {
  const requests = getProofRequests();
  const idx = requests.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  requests[idx].status = 'Approved';
  requests[idx].documentRef = `POR-${new Date().getFullYear()}-${generateId('').slice(-6)}`;
  requests[idx].approvedAt = new Date().toISOString();
  requests[idx].approvedBy = staffId;
  setStore('proofRequests', requests);
  logAudit('proof_of_residence_approved', { documentRef: requests[idx].documentRef }, staffId);
  return requests[idx];
}

export function rejectProofRequest(id, reason, staffId) {
  const requests = getProofRequests();
  const idx = requests.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  requests[idx].status = 'Rejected';
  requests[idx].rejectionReason = reason;
  requests[idx].rejectedAt = new Date().toISOString();
  requests[idx].rejectedBy = staffId;
  setStore('proofRequests', requests);
  logAudit('proof_of_residence_rejected', { reason }, staffId);
  return requests[idx];
}
