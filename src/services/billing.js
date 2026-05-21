import { getStore, setStore, generateId } from './storage';
import { logAudit } from './audit';

export const PAYMENT_METHODS = [
  { id: 'payfast', name: 'PayFast', description: 'Card, EFT, instant EFT' },
  { id: 'ozow', name: 'Ozow', description: 'Instant EFT from your bank' },
  { id: 'peach', name: 'Peach Payments', description: 'Credit & debit cards' },
  { id: 'eft', name: 'EFT / Bank Transfer', description: 'Manual EFT with reference' },
];

export const PAYMENT_STATUS = { PENDING: 'pending', SUCCESSFUL: 'successful', FAILED: 'failed' };

export function getAccounts() {
  return getStore('accounts', []);
}

export function getAccount(accountNumber) {
  return getAccounts().find((a) => a.accountNumber === accountNumber);
}

export function getAccountForUser(user) {
  if (!user?.accountNumber) return null;
  return getAccount(user.accountNumber);
}

export function getDemoAccount() {
  return getAccounts()[0];
}

export function getAllPayments() {
  return getStore('paymentRecords', []);
}

export function initiatePayment(accountNumber, amount, method, userId) {
  const payment = {
    id: generateId('PAY'),
    accountNumber,
    amount,
    method: PAYMENT_METHODS.find((m) => m.id === method)?.name || method,
    methodId: method,
    status: PAYMENT_STATUS.PENDING,
    reference: `${method.toUpperCase().slice(0, 2)}-${Date.now().toString(36).toUpperCase()}`,
    receiptRef: null,
    userId,
    createdAt: new Date().toISOString(),
    date: null,
  };

  const records = getAllPayments();
  records.unshift(payment);
  setStore('paymentRecords', records);
  logAudit('payment_initiated', { reference: payment.reference, amount, method }, userId);
  return payment;
}

export function completePayment(paymentId, success = true) {
  const records = getAllPayments();
  const idx = records.findIndex((p) => p.id === paymentId);
  if (idx === -1) return { success: false, error: 'Payment not found' };

  const payment = records[idx];
  if (!success) {
    payment.status = PAYMENT_STATUS.FAILED;
    payment.date = new Date().toISOString();
    setStore('paymentRecords', records);
    logAudit('payment_failed', { reference: payment.reference }, payment.userId);
    return { success: false, payment };
  }

  payment.status = PAYMENT_STATUS.SUCCESSFUL;
  payment.date = new Date().toISOString();
  payment.receiptRef = `RCP-${Date.now().toString(36).toUpperCase()}`;

  const accounts = getAccounts();
  const accIdx = accounts.findIndex((a) => a.accountNumber === payment.accountNumber);
  if (accIdx !== -1) {
    accounts[accIdx].payments.unshift({
      id: payment.id,
      amount: payment.amount,
      method: payment.method,
      date: payment.date,
      reference: payment.reference,
      receiptRef: payment.receiptRef,
      status: payment.status,
    });
    accounts[accIdx].balance = Math.max(0, accounts[accIdx].balance - payment.amount);
    const unpaidBill = accounts[accIdx].bills.find((b) => b.status === 'Unpaid');
    if (unpaidBill) unpaidBill.status = 'Paid';
    setStore('accounts', accounts);
  }

  setStore('paymentRecords', records);
  logAudit('payment_successful', { reference: payment.reference, amount: payment.amount }, payment.userId);
  return { success: true, payment, account: accIdx !== -1 ? accounts[accIdx] : null };
}

export function processPayment(accountNumber, amount, method, userId) {
  const payment = initiatePayment(accountNumber, amount, method, userId);
  return completePayment(payment.id, true);
}

export function uploadBill(accountNumber, billData) {
  const accounts = getAccounts();
  const idx = accounts.findIndex((a) => a.accountNumber === accountNumber);
  if (idx === -1) return { success: false, error: 'Account not found' };

  const bill = {
    id: generateId('BILL'),
    period: billData.period,
    amount: parseFloat(billData.amount),
    status: 'Unpaid',
    issuedAt: new Date().toISOString(),
    charges: billData.charges || [],
  };
  accounts[idx].bills.unshift(bill);
  accounts[idx].balance += bill.amount;
  accounts[idx].dueDate = billData.dueDate || new Date(Date.now() + 86400000 * 30).toISOString();
  setStore('accounts', accounts);
  logAudit('bill_uploaded', { accountNumber, period: bill.period }, null);
  return { success: true, bill };
}

export function getPaymentReport() {
  const payments = getAllPayments();
  return {
    total: payments.length,
    successful: payments.filter((p) => p.status === PAYMENT_STATUS.SUCCESSFUL).length,
    pending: payments.filter((p) => p.status === PAYMENT_STATUS.PENDING).length,
    failed: payments.filter((p) => p.status === PAYMENT_STATUS.FAILED).length,
    totalAmount: payments.filter((p) => p.status === PAYMENT_STATUS.SUCCESSFUL).reduce((s, p) => s + p.amount, 0),
    payments,
  };
}
