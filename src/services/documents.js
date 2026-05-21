import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { logAudit } from './audit';

const MUNI_NAME = 'SmartCity Municipality';
const MUNI_ADDRESS = '1 Municipal Drive, SmartCity, 0001';
const MUNI_TEL = '012 345 6000';
const MUNI_EMAIL = 'billing@smartcity.gov.za';

function addBranding(doc) {
  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(MUNI_NAME, 15, 18);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${MUNI_ADDRESS} | Tel: ${MUNI_TEL}`, 15, 26);
  doc.setTextColor(15, 23, 42);
}

function addFooter(doc, ref) {
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Document Ref: ${ref} | Generated: ${new Date().toLocaleString('en-ZA')}`, 15, 285);
  doc.text('This document is issued in terms of POPIA. Verify at verify.smartcity.gov.za', 15, 290);
}

export async function generateProofOfResidencePDF(user, account, documentRef) {
  const doc = new jsPDF();
  addBranding(doc);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PROOF OF RESIDENCE', 15, 50);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const lines = [
    ['Resident Name:', `${user.firstName} ${user.lastName}`],
    ['ID Number:', user.idNumber],
    ['Property Address:', account.address],
    ['Municipal Account:', account.accountNumber],
    ['Date Issued:', new Date().toLocaleDateString('en-ZA')],
    ['Document Reference:', documentRef],
  ];
  let y = 65;
  lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 70, y);
    y += 12;
  });

  doc.setFontSize(10);
  doc.text('This certifies that the above-named person is a registered resident at the property address listed.', 15, y + 10, { maxWidth: 180 });

  const verifyUrl = `https://verify.smartcity.gov.za/por/${documentRef}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
  doc.addImage(qrDataUrl, 'PNG', 145, 65, 45, 45);
  doc.setFontSize(8);
  doc.text('Scan to verify', 150, 115);

  addFooter(doc, documentRef);
  doc.save(`proof-of-residence-${documentRef}.pdf`);
  logAudit('document_downloaded', { type: 'proof_of_residence', ref: documentRef }, user.id);
}

export async function generateStatementPDF(user, account) {
  const ref = `STMT-${Date.now().toString(36).toUpperCase()}`;
  const doc = new jsPDF();
  addBranding(doc);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('MUNICIPAL ACCOUNT STATEMENT', 15, 50);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Account Holder: ${user.firstName} ${user.lastName}`, 15, 62);
  doc.text(`Account Number: ${account.accountNumber}`, 15, 69);
  doc.text(`Property: ${account.address}`, 15, 76);
  doc.text(`Statement Date: ${new Date().toLocaleDateString('en-ZA')}`, 15, 83);

  let y = 98;
  doc.setFont('helvetica', 'bold');
  doc.text('Billing Period', 15, y);
  doc.text('Amount', 100, y);
  doc.text('Status', 150, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  account.bills.forEach((b) => {
    doc.text(b.period, 15, y);
    doc.text(`R ${b.amount.toFixed(2)}`, 100, y);
    doc.text(b.status, 150, y);
    y += 8;
  });

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Payment History', 15, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  account.payments.forEach((p) => {
    doc.text(`${new Date(p.date).toLocaleDateString('en-ZA')} - ${p.method} (${p.reference})`, 15, y);
    doc.text(`R ${p.amount.toFixed(2)}`, 150, y);
    y += 8;
  });

  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Current Balance: R ${account.balance.toFixed(2)}`, 15, y);
  doc.text(`Due Date: ${new Date(account.dueDate).toLocaleDateString('en-ZA')}`, 15, y + 10);

  addFooter(doc, ref);
  doc.save(`statement-${account.accountNumber}.pdf`);
  logAudit('document_downloaded', { type: 'statement', ref }, user.id);
}

export async function generateReceiptPDF(user, account, payment) {
  const ref = payment.receiptRef || `RCP-${payment.reference}`;
  const doc = new jsPDF();
  addBranding(doc);

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 15, 50);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const lines = [
    ['Receipt No:', ref],
    ['Payment Reference:', payment.reference],
    ['Account Number:', account.accountNumber],
    ['Paid By:', `${user.firstName} ${user.lastName}`],
    ['Amount Paid:', `R ${payment.amount.toFixed(2)}`],
    ['Payment Method:', payment.method],
    ['Status:', payment.status || 'successful'],
    ['Date:', new Date(payment.date).toLocaleString('en-ZA')],
  ];
  let y = 65;
  lines.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 15, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), 65, y);
    y += 12;
  });

  doc.setFontSize(10);
  doc.text('Thank you for your payment. This receipt serves as proof of payment.', 15, y + 10);

  addFooter(doc, ref);
  doc.save(`receipt-${payment.reference}.pdf`);
  logAudit('document_downloaded', { type: 'receipt', ref }, user.id);
}
