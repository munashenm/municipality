import { getStore, setStore } from './storage';

export function seedData() {
  if (getStore('_seeded')) return;

  setStore('reports', [
    {
      id: 'RPT-001',
      ticketNumber: '#IS-1042',
      type: 'Pothole',
      description: 'Large pothole on Main Rd near the traffic light',
      location: 'Main Rd, Ward 3',
      gps: { lat: -26.2041, lng: 28.0473 },
      status: 'Open',
      photos: [],
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updates: [{ status: 'Open', message: 'Report received', date: new Date(Date.now() - 86400000 * 2).toISOString() }],
      reporterName: 'Thabo M.',
      reporterPhone: '0821234567',
    },
    {
      id: 'RPT-002',
      ticketNumber: '#IS-1043',
      type: 'Water Leak',
      description: 'Burst pipe flooding the street',
      location: 'Block C, Extension 5',
      gps: { lat: -26.1950, lng: 28.0340 },
      status: 'In Progress',
      photos: [],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updates: [
        { status: 'Open', message: 'Report received', date: new Date(Date.now() - 86400000).toISOString() },
        { status: 'In Progress', message: 'Water team dispatched', date: new Date(Date.now() - 43200000).toISOString() },
      ],
      reporterName: 'Sarah K.',
      reporterPhone: '0839876543',
    },
  ]);

  setStore('accounts', [
    {
      id: 'ACC-001',
      accountNumber: 'MUN-2024-78432',
      name: 'Demo Citizen',
      address: '12 Nelson Mandela Drive, SmartCity',
      balance: 2450.75,
      dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      bills: [
        { id: 'BILL-001', period: 'March 2026', amount: 2450.75, status: 'Unpaid', issuedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
        { id: 'BILL-002', period: 'February 2026', amount: 2180.50, status: 'Paid', issuedAt: new Date(Date.now() - 86400000 * 35).toISOString() },
      ],
      payments: [
        { id: 'PAY-001', amount: 2180.50, method: 'PayFast', date: new Date(Date.now() - 86400000 * 20).toISOString(), reference: 'PF-882934' },
      ],
    },
  ]);

  setStore('alerts', [
    {
      id: 'ALT-001',
      type: 'water',
      priority: 'high',
      title: 'Scheduled Water Interruption: Zone 4',
      message: 'Water supply will be interrupted for maintenance from 10:00 to 16:00.',
      area: 'Zone 4, Ward 2',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      active: true,
    },
    {
      id: 'ALT-002',
      type: 'loadshedding',
      priority: 'medium',
      title: 'Stage 2 Load Shedding Active',
      message: 'Eskom Stage 2 loadshedding in effect until 22:00. Block 7 affected 18:00-20:30.',
      area: 'All areas',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 43200000).toISOString(),
      active: true,
    },
    {
      id: 'ALT-003',
      type: 'maintenance',
      priority: 'low',
      title: 'Road Resurfacing: Oak Avenue',
      message: 'Planned road maintenance on Oak Ave from 6-10 May. Expect delays.',
      area: 'Oak Avenue',
      startDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      active: true,
    },
  ]);

  setStore('jobs', [
    {
      id: 'JOB-001',
      type: 'Vacancy',
      title: 'Senior Civil Engineer',
      department: 'Infrastructure',
      description: 'Lead municipal infrastructure projects including roads, water, and sanitation.',
      requirements: 'BEng Civil, 5+ years experience, ECSA registration preferred',
      closingDate: new Date(Date.now() + 86400000 * 21).toISOString(),
      status: 'Open',
      applications: [],
    },
    {
      id: 'JOB-002',
      type: 'Tender',
      title: 'Supply of Refuse Collection Vehicles',
      reference: 'TDR/2026/014',
      department: 'Waste Management',
      description: 'Supply and delivery of 4 refuse collection vehicles (15-ton capacity).',
      requirements: 'CSD registered, B-BBEE Level 1-4, valid tax clearance',
      closingDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      status: 'Open',
      applications: [],
    },
    {
      id: 'JOB-003',
      type: 'RFQ',
      title: 'Office Stationery Supply',
      reference: 'RFQ/2026/089',
      department: 'Supply Chain',
      description: 'Annual supply of office stationery for all municipal departments.',
      requirements: 'Local supplier within 50km radius preferred',
      closingDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      status: 'Open',
      applications: [],
    },
  ]);

  setStore('queueDepartments', [
    { id: 'DEPT-ID', name: 'IDs & Documentation', icon: 'id', slots: generateSlots() },
    { id: 'DEPT-LIC', name: 'Licensing', icon: 'license', slots: generateSlots() },
    { id: 'DEPT-BILL', name: 'Billing Office', icon: 'billing', slots: generateSlots() },
    { id: 'DEPT-HOUS', name: 'Housing Department', icon: 'housing', slots: generateSlots() },
    { id: 'DEPT-BUILD', name: 'Building Plans', icon: 'building', slots: generateSlots() },
  ]);

  setStore('bookings', []);

  setStore('notices', [
    {
      id: 'NOT-001',
      category: 'Event',
      title: 'Community Clean-Up Day',
      content: 'Join us this Saturday for a ward-wide clean-up. Gloves and bags provided at the community hall from 08:00.',
      location: 'Ward 5 Community Hall',
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'NOT-002',
      category: 'Road Closure',
      title: 'Church Street Closed for Repairs',
      content: 'Church Street between 1st and 3rd Ave will be closed 7-14 May for stormwater drain repairs.',
      location: 'Church Street',
      date: new Date(Date.now() + 86400000 * 5).toISOString(),
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'NOT-003',
      category: 'Public Participation',
      title: 'IDP Review Meeting',
      content: 'Residents are invited to review and comment on the Integrated Development Plan for 2026/27.',
      location: 'Municipal Chambers',
      date: new Date(Date.now() + 86400000 * 10).toISOString(),
      publishedAt: new Date().toISOString(),
    },
  ]);

  setStore('notificationPrefs', {
    loadshedding: true,
    water: true,
    maintenance: true,
    emergency: true,
    billing: true,
    pushEnabled: false,
  });

  setStore('notifications', []);

  setStore('disputes', []);
  setStore('meterReadings', []);
  setStore('proofRequests', []);
  setStore('paymentRecords', []);
  setStore('auditLogs', []);
  setStore('pendingOtps', {});

  setStore('_seeded', true);
}

export async function seedAuthData() {
  const users = getStore('users', []);
  const hasDemoUsers = users.some((u) => u.email === 'thabo@demo.co.za');
  if (getStore('_authSeeded') && hasDemoUsers) return;

  const { hashPassword } = await import('./crypto');
  const demoHash = await hashPassword('Demo@123');
  const staffHash = await hashPassword('Staff@123');
  const adminHash = await hashPassword('Admin@123');

  setStore('users', [
    {
      id: 'USR-DEMO-001',
      email: 'thabo@demo.co.za',
      phone: '0821234567',
      idNumber: '9001015800085',
      accountNumber: 'MUN-2024-78432',
      firstName: 'Thabo',
      lastName: 'Mokoena',
      role: 'citizen',
      passwordSalt: demoHash.salt,
      passwordHash: demoHash.hash,
      verified: true,
      verifiedAt: new Date().toISOString(),
      popiaConsent: true,
      popiaConsentDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    },
    {
      id: 'USR-STAFF-001',
      email: 'staff@municipality.gov.za',
      phone: '0829998888',
      idNumber: '8506154800087',
      accountNumber: null,
      firstName: 'Lerato',
      lastName: 'Nkosi',
      role: 'staff',
      passwordSalt: staffHash.salt,
      passwordHash: staffHash.hash,
      verified: true,
      verifiedAt: new Date().toISOString(),
      popiaConsent: true,
      popiaConsentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-ADMIN-001',
      email: 'admin@municipality.gov.za',
      phone: '0821112222',
      idNumber: '7803124800083',
      accountNumber: null,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      passwordSalt: adminHash.salt,
      passwordHash: adminHash.hash,
      verified: true,
      verifiedAt: new Date().toISOString(),
      popiaConsent: true,
      popiaConsentDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]);

  const accounts = getStore('accounts', []);
  if (accounts[0]) {
    accounts[0].name = 'Thabo Mokoena';
    setStore('accounts', accounts);
  }

  setStore('_authSeeded', true);
}

function generateSlots() {
  const slots = [];
  const today = new Date();
  for (let d = 1; d <= 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].forEach((time) => {
      slots.push({
        id: `SLOT-${date.toISOString().slice(0, 10)}-${time.replace(':', '')}`,
        date: date.toISOString().slice(0, 10),
        time,
        available: Math.random() > 0.3,
      });
    });
  }
  return slots;
}
