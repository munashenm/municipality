import { getStore, setStore } from './storage';

const PRESENTATION_VERSION = 1;
const THABO_ID = 'USR-DEMO-001';
const SARAH_ID = 'USR-DEMO-002';
const THABO_ACCOUNT = 'MUN-2024-78432';
const SARAH_ACCOUNT = 'MUN-2024-91567';

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
  const hasSarah = users.some((u) => u.email === 'sarah@demo.co.za');
  if (getStore('_authSeeded') && hasDemoUsers && hasSarah) return;

  const { hashPassword } = await import('./crypto');
  const demoHash = await hashPassword('Demo@123');
  const staffHash = await hashPassword('Staff@123');
  const adminHash = await hashPassword('Admin@123');

  setStore('users', [
    {
      id: THABO_ID,
      email: 'thabo@demo.co.za',
      phone: '0821234567',
      idNumber: '9001015800085',
      accountNumber: THABO_ACCOUNT,
      firstName: 'Thabo',
      lastName: 'Mokoena',
      role: 'citizen',
      passwordSalt: demoHash.salt,
      passwordHash: demoHash.hash,
      verified: true,
      verifiedAt: new Date().toISOString(),
      popiaConsent: true,
      popiaConsentDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 90).toISOString(),
    },
    {
      id: SARAH_ID,
      email: 'sarah@demo.co.za',
      phone: '0839876543',
      idNumber: '9208155800082',
      accountNumber: SARAH_ACCOUNT,
      firstName: 'Sarah',
      lastName: 'Khumalo',
      role: 'citizen',
      passwordSalt: demoHash.salt,
      passwordHash: demoHash.hash,
      verified: true,
      verifiedAt: new Date().toISOString(),
      popiaConsent: true,
      popiaConsentDate: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
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

  setStore('_authSeeded', true);
}

export function seedPresentationData() {
  if (getStore('_presentationVersion') === PRESENTATION_VERSION) return;

  const days = (n) => new Date(Date.now() - 86400000 * n).toISOString();
  const daysAhead = (n) => new Date(Date.now() + 86400000 * n).toISOString();

  setStore('reports', [
    {
      id: 'RPT-001',
      ticketNumber: '#IS-1042',
      type: 'Pothole',
      description: 'Deep pothole on Nelson Mandela Drive causing tyre damage. Approximately 40cm wide.',
      location: '12 Nelson Mandela Drive, Ward 3',
      gps: { lat: -26.2041, lng: 28.0473 },
      status: 'In Progress',
      photos: [],
      createdAt: days(5),
      updates: [
        { status: 'Open', message: 'Report received and logged.', date: days(5) },
        { status: 'In Progress', message: 'Roads team assigned. Repair scheduled within 48 hours.', date: days(3) },
      ],
      reporterName: 'Thabo Mokoena',
      reporterPhone: '0821234567',
      reporterEmail: 'thabo@demo.co.za',
    },
    {
      id: 'RPT-002',
      ticketNumber: '#IS-1043',
      type: 'Water Leak',
      description: 'Burst pipe flooding the pavement on Block C.',
      location: 'Block C, Extension 5, Ward 7',
      gps: { lat: -26.1950, lng: 28.0340 },
      status: 'In Progress',
      photos: [],
      createdAt: days(2),
      updates: [
        { status: 'Open', message: 'Report received.', date: days(2) },
        { status: 'In Progress', message: 'Water team dispatched. Valve shut off.', date: days(1) },
      ],
      reporterName: 'Sarah Khumalo',
      reporterPhone: '0839876543',
      reporterEmail: 'sarah@demo.co.za',
    },
    {
      id: 'RPT-003',
      ticketNumber: '#IS-1038',
      type: 'Broken Street Light',
      description: 'Street light not working for 2 weeks. Safety concern at night.',
      location: 'Corner Main Rd & Oak Ave, Ward 3',
      gps: { lat: -26.2010, lng: 28.0420 },
      status: 'Resolved',
      photos: [],
      createdAt: days(14),
      updates: [
        { status: 'Open', message: 'Report received.', date: days(14) },
        { status: 'In Progress', message: 'Electrician assigned.', date: days(12) },
        { status: 'Resolved', message: 'Light replaced and tested. Issue closed.', date: days(10) },
      ],
      reporterName: 'Thabo Mokoena',
      reporterPhone: '0821234567',
      reporterEmail: 'thabo@demo.co.za',
    },
    {
      id: 'RPT-004',
      ticketNumber: '#IS-1045',
      type: 'Illegal Dumping',
      description: 'Household waste dumped on vacant plot.',
      location: 'Plot 44, Extension 2',
      gps: { lat: -26.2100, lng: 28.0510 },
      status: 'Open',
      photos: [],
      createdAt: days(1),
      updates: [{ status: 'Open', message: 'Report received. Waste management notified.', date: days(1) }],
      reporterName: 'David N.',
      reporterPhone: '0845551234',
    },
    {
      id: 'RPT-005',
      ticketNumber: '#IS-1046',
      type: 'Electricity Outage',
      description: 'Power out in entire street since 06:00.',
      location: 'Church Street, Ward 4',
      gps: { lat: -26.1980, lng: 28.0390 },
      status: 'Open',
      photos: [],
      createdAt: days(0),
      updates: [{ status: 'Open', message: 'Outage logged. Eskom/municipal team investigating.', date: days(0) }],
      reporterName: 'Maria P.',
      reporterPhone: '0723338899',
    },
  ]);

  setStore('accounts', [
    {
      id: 'ACC-001',
      accountNumber: THABO_ACCOUNT,
      name: 'Thabo Mokoena',
      address: '12 Nelson Mandela Drive, SmartCity, 0001',
      balance: 2450.75,
      dueDate: daysAhead(14),
      bills: [
        { id: 'BILL-001', period: 'May 2026', amount: 2450.75, status: 'Unpaid', issuedAt: days(3), charges: [{ item: 'Water', amount: 680 }, { item: 'Electricity', amount: 1120 }, { item: 'Refuse', amount: 350 }, { item: 'Rates', amount: 300.75 }] },
        { id: 'BILL-002', period: 'April 2026', amount: 2310.20, status: 'Paid', issuedAt: days(33) },
        { id: 'BILL-003', period: 'March 2026', amount: 2180.50, status: 'Paid', issuedAt: days(63) },
        { id: 'BILL-004', period: 'February 2026', amount: 2055.00, status: 'Paid', issuedAt: days(93) },
      ],
      payments: [
        { id: 'PAY-001', amount: 2310.20, method: 'PayFast', date: days(18), reference: 'PF-882934', receiptRef: 'RCP-PF882934', status: 'successful' },
        { id: 'PAY-002', amount: 2180.50, method: 'Ozow', date: days(48), reference: 'OZ-771203', receiptRef: 'RCP-OZ771203', status: 'successful' },
        { id: 'PAY-003', amount: 2055.00, method: 'Peach Payments', date: days(78), reference: 'PC-660112', receiptRef: 'RCP-PC660112', status: 'successful' },
      ],
    },
    {
      id: 'ACC-002',
      accountNumber: SARAH_ACCOUNT,
      name: 'Sarah Khumalo',
      address: '8 Church Street, Extension 5, SmartCity, 0001',
      balance: 1875.30,
      dueDate: daysAhead(10),
      bills: [
        { id: 'BILL-101', period: 'May 2026', amount: 1875.30, status: 'Unpaid', issuedAt: days(3) },
        { id: 'BILL-102', period: 'April 2026', amount: 1720.00, status: 'Paid', issuedAt: days(33) },
      ],
      payments: [
        { id: 'PAY-101', amount: 1720.00, method: 'PayFast', date: days(20), reference: 'PF-991045', receiptRef: 'RCP-PF991045', status: 'successful' },
      ],
    },
  ]);

  setStore('paymentRecords', [
    { id: 'PAY-001', accountNumber: THABO_ACCOUNT, amount: 2310.20, method: 'PayFast', methodId: 'payfast', status: 'successful', reference: 'PF-882934', receiptRef: 'RCP-PF882934', userId: THABO_ID, createdAt: days(18), date: days(18) },
    { id: 'PAY-002', accountNumber: THABO_ACCOUNT, amount: 2180.50, method: 'Ozow', methodId: 'ozow', status: 'successful', reference: 'OZ-771203', receiptRef: 'RCP-OZ771203', userId: THABO_ID, createdAt: days(48), date: days(48) },
    { id: 'PAY-003', accountNumber: THABO_ACCOUNT, amount: 2055.00, method: 'Peach Payments', methodId: 'peach', status: 'successful', reference: 'PC-660112', receiptRef: 'RCP-PC660112', userId: THABO_ID, createdAt: days(78), date: days(78) },
    { id: 'PAY-101', accountNumber: SARAH_ACCOUNT, amount: 1720.00, method: 'PayFast', methodId: 'payfast', status: 'successful', reference: 'PF-991045', receiptRef: 'RCP-PF991045', userId: SARAH_ID, createdAt: days(20), date: days(20) },
  ]);

  setStore('disputes', [
    {
      id: 'DSP-001',
      reference: 'DSP-MCJ8K2',
      userId: THABO_ID,
      type: 'Incorrect Charge',
      subject: 'Water meter reading seems too high',
      description: 'My May bill shows 45kl usage but we were away for 2 weeks. Please review meter reading.',
      accountNumber: THABO_ACCOUNT,
      status: 'Under Review',
      createdAt: days(4),
      updates: [
        { status: 'Submitted', message: 'Your dispute has been received.', date: days(4) },
        { status: 'Under Review', message: 'Billing department is verifying meter readings.', date: days(2) },
      ],
    },
    {
      id: 'DSP-002',
      reference: 'DSP-MCJ7A1',
      userId: THABO_ID,
      type: 'Service Query',
      subject: 'Query about indigent rebate application',
      description: 'I submitted indigent support documents last month. What is the status?',
      accountNumber: THABO_ACCOUNT,
      status: 'Resolved',
      createdAt: days(20),
      updates: [
        { status: 'Submitted', message: 'Your query has been received.', date: days(20) },
        { status: 'Under Review', message: 'Social development team reviewing application.', date: days(15) },
        { status: 'Resolved', message: 'Approved. Rebate will reflect on June bill.', date: days(8) },
      ],
    },
    {
      id: 'DSP-003',
      reference: 'DSP-MCJ9P3',
      userId: SARAH_ID,
      type: 'Billing Dispute',
      subject: 'Duplicate charge on April bill',
      description: 'Refuse removal charged twice on my April statement.',
      accountNumber: SARAH_ACCOUNT,
      status: 'Submitted',
      createdAt: days(1),
      updates: [{ status: 'Submitted', message: 'Your dispute has been received.', date: days(1) }],
    },
  ]);

  setStore('meterReadings', [
    { id: 'MR-001', userId: THABO_ID, accountNumber: THABO_ACCOUNT, meterType: 'Water', reading: 1247, photo: null, submittedAt: days(6), status: 'Processed' },
    { id: 'MR-002', userId: THABO_ID, accountNumber: THABO_ACCOUNT, meterType: 'Electricity', reading: 8834, photo: null, submittedAt: days(6), status: 'Processed' },
    { id: 'MR-003', userId: THABO_ID, accountNumber: THABO_ACCOUNT, meterType: 'Water', reading: 1289, photo: null, submittedAt: days(0), status: 'Received' },
    { id: 'MR-004', userId: SARAH_ID, accountNumber: SARAH_ACCOUNT, meterType: 'Water', reading: 956, photo: null, submittedAt: days(3), status: 'Processed' },
  ]);

  setStore('proofRequests', [
    {
      id: 'POR-001',
      userId: THABO_ID,
      accountNumber: THABO_ACCOUNT,
      status: 'Approved',
      documentRef: 'POR-2026-78432',
      requestedAt: days(30),
      approvedAt: days(28),
      approvedBy: 'USR-STAFF-001',
    },
    {
      id: 'POR-002',
      userId: SARAH_ID,
      accountNumber: SARAH_ACCOUNT,
      status: 'Pending',
      documentRef: null,
      requestedAt: days(2),
    },
  ]);

  const slotDate = nextWeekday(2);
  setStore('bookings', [
    {
      id: 'BK-001',
      reference: 'Q-MCJ8THABO',
      departmentId: 'DEPT-BILL',
      departmentName: 'Billing Office',
      slotId: `SLOT-${slotDate}-1000`,
      date: slotDate,
      time: '10:00',
      citizenName: 'Thabo Mokoena',
      citizenPhone: '0821234567',
      citizenId: '9001015800085',
      purpose: 'Query May bill and payment plan',
      status: 'Confirmed',
      createdAt: days(1),
    },
    {
      id: 'BK-002',
      reference: 'Q-MCJ8SARAH',
      departmentId: 'DEPT-LIC',
      departmentName: 'Licensing',
      slotId: `SLOT-${slotDate}-1400`,
      date: slotDate,
      time: '14:00',
      citizenName: 'Sarah Khumalo',
      citizenPhone: '0839876543',
      citizenId: '9208155800082',
      purpose: 'Driver licence renewal',
      status: 'Confirmed',
      createdAt: days(2),
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
      closingDate: daysAhead(21),
      status: 'Open',
      applications: [
        {
          id: 'APP-DEMO01',
          companyName: 'Thabo Mokoena',
          contactName: 'Thabo Mokoena',
          email: 'thabo@demo.co.za',
          phone: '0821234567',
          coverLetter: 'I am interested in contributing to SmartCity infrastructure development.',
          documents: [],
          status: 'Under Review',
          submittedAt: days(7),
          updates: [
            { status: 'Submitted', message: 'Application received', date: days(7) },
            { status: 'Under Review', message: 'HR reviewing qualifications', date: days(4) },
          ],
        },
      ],
      createdAt: days(30),
    },
    {
      id: 'JOB-002',
      type: 'Tender',
      title: 'Supply of Refuse Collection Vehicles',
      reference: 'TDR/2026/014',
      department: 'Waste Management',
      description: 'Supply and delivery of 4 refuse collection vehicles (15-ton capacity).',
      requirements: 'CSD registered, B-BBEE Level 1-4, valid tax clearance',
      closingDate: daysAhead(30),
      status: 'Open',
      applications: [
        {
          id: 'APP-DEMO02',
          companyName: 'Khumalo Trading Pty Ltd',
          contactName: 'Sarah Khumalo',
          email: 'sarah@demo.co.za',
          phone: '0839876543',
          coverLetter: 'We supply municipal fleet vehicles across Gauteng.',
          documents: [{ name: 'CSD Certificate.pdf' }],
          status: 'Shortlisted',
          submittedAt: days(10),
          updates: [
            { status: 'Submitted', message: 'Application received', date: days(10) },
            { status: 'Under Review', message: 'Documents verified', date: days(6) },
            { status: 'Shortlisted', message: 'Shortlisted for presentation', date: days(2) },
          ],
        },
      ],
      createdAt: days(25),
    },
    {
      id: 'JOB-003',
      type: 'RFQ',
      title: 'Office Stationery Supply',
      reference: 'RFQ/2026/089',
      department: 'Supply Chain',
      description: 'Annual supply of office stationery for all municipal departments.',
      requirements: 'Local supplier within 50km radius preferred',
      closingDate: daysAhead(14),
      status: 'Open',
      applications: [],
      createdAt: days(10),
    },
    {
      id: 'JOB-004',
      type: 'Quotation',
      title: 'Paving of Community Hall Parking',
      reference: 'QUO/2026/031',
      department: 'Community Services',
      description: 'Supply and install paving for 200sqm parking area at Ward 5 Community Hall.',
      requirements: 'Valid CIDB grading 1CE or higher',
      closingDate: daysAhead(18),
      status: 'Open',
      applications: [],
      createdAt: days(5),
    },
  ]);

  setStore('notifications', [
    { id: 'NOTIF-001', title: 'Scheduled Water Interruption: Zone 4', message: 'Water supply interrupted 10:00–16:00 today.', type: 'water', read: false, date: days(0) },
    { id: 'NOTIF-002', title: 'Stage 2 Load Shedding Active', message: 'Block 7 affected 18:00–20:30.', type: 'loadshedding', read: false, date: days(0) },
    { id: 'NOTIF-003', title: 'Bill Due Reminder', message: 'Your May bill of R2,450.75 is due in 14 days.', type: 'billing', read: true, date: days(2) },
    { id: 'NOTIF-004', title: 'Dispute Update', message: 'Your water meter dispute is under review.', type: 'billing', read: true, date: days(2) },
  ]);

  setStore('auditLogs', [
    { id: 'AUD-001', action: 'login_success', userId: THABO_ID, details: { role: 'citizen' }, timestamp: days(0), ip: '102.66.12.45' },
    { id: 'AUD-002', action: 'payment_successful', userId: THABO_ID, details: { reference: 'PF-882934', amount: 2310.20 }, timestamp: days(18), ip: '102.66.12.45' },
    { id: 'AUD-003', action: 'document_downloaded', userId: THABO_ID, details: { type: 'proof_of_residence', ref: 'POR-2026-78432' }, timestamp: days(25), ip: '102.66.12.45' },
    { id: 'AUD-004', action: 'dispute_submitted', userId: THABO_ID, details: { reference: 'DSP-MCJ8K2' }, timestamp: days(4), ip: '102.66.12.45' },
    { id: 'AUD-005', action: 'meter_reading_submitted', userId: THABO_ID, details: { meterType: 'Water', reading: 1289 }, timestamp: days(0), ip: '102.66.12.45' },
    { id: 'AUD-006', action: 'proof_of_residence_requested', userId: SARAH_ID, details: { accountNumber: SARAH_ACCOUNT }, timestamp: days(2), ip: '41.77.88.102' },
    { id: 'AUD-007', action: 'login_success', userId: 'USR-STAFF-001', details: { role: 'staff' }, timestamp: days(0), ip: '196.25.10.8' },
    { id: 'AUD-008', action: 'proof_of_residence_approved', userId: 'USR-STAFF-001', details: { documentRef: 'POR-2026-78432' }, timestamp: days(28), ip: '196.25.10.8' },
    { id: 'AUD-009', action: 'bill_uploaded', userId: null, details: { accountNumber: THABO_ACCOUNT, period: 'May 2026' }, timestamp: days(3), ip: '196.25.10.8' },
    { id: 'AUD-010', action: 'dispute_updated', userId: 'USR-STAFF-001', details: { reference: 'DSP-MCJ8K2', status: 'Under Review' }, timestamp: days(2), ip: '196.25.10.8' },
  ]);

  const departments = getStore('queueDepartments', []);
  const bookedSlots = [`SLOT-${slotDate}-1000`, `SLOT-${slotDate}-1400`];
  departments.forEach((dept) => {
    dept.slots.forEach((slot) => {
      if (bookedSlots.includes(slot.id)) slot.available = false;
    });
  });
  setStore('queueDepartments', departments);

  setStore('_presentationVersion', PRESENTATION_VERSION);
}

function nextWeekday(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function generateSlots() {
  const slots = [];
  const today = new Date();
  let idx = 0;
  for (let d = 1; d <= 7; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() + d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].forEach((time) => {
      slots.push({
        id: `SLOT-${date.toISOString().slice(0, 10)}-${time.replace(':', '')}`,
        date: date.toISOString().slice(0, 10),
        time,
        available: idx % 3 !== 0,
      });
      idx += 1;
    });
  }
  return slots;
}
