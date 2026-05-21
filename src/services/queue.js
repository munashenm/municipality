import { getStore, setStore, generateId } from './storage';

export const QUEUE_DEPARTMENTS = [
  { id: 'DEPT-LIC', name: 'Licensing', description: "Driver's licence, vehicle registration & permits" },
  { id: 'DEPT-BILL', name: 'Billing', description: 'Account queries, payments & statements' },
  { id: 'DEPT-HOUS', name: 'Housing', description: 'Housing applications, allocations & subsidies' },
  { id: 'DEPT-PLAN', name: 'Town Planning', description: 'Building plans, rezoning & land use' },
  { id: 'DEPT-CARE', name: 'Customer Care', description: 'General enquiries & service requests' },
];

export function generateSlots() {
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

export function createDefaultDepartments() {
  return QUEUE_DEPARTMENTS.map(({ id, name, description }) => ({
    id,
    name,
    description,
    slots: generateSlots(),
  }));
}

export function getDepartments() {
  return getStore('queueDepartments', []);
}

export function getDepartment(id) {
  return getDepartments().find((d) => d.id === id);
}

export function getBookings() {
  return getStore('bookings', []);
}

export function getBooking(ref) {
  return getBookings().find((b) => b.reference === ref);
}

export function createBooking(data) {
  const departments = getDepartments();
  const deptIdx = departments.findIndex((d) => d.id === data.departmentId);
  if (deptIdx === -1) return { success: false, error: 'Department not found' };

  const slotIdx = departments[deptIdx].slots.findIndex((s) => s.id === data.slotId && s.available);
  if (slotIdx === -1) return { success: false, error: 'Slot no longer available' };

  departments[deptIdx].slots[slotIdx].available = false;
  setStore('queueDepartments', departments);

  const booking = {
    id: generateId('BK'),
    reference: `Q-${Date.now().toString(36).toUpperCase()}`,
    departmentId: data.departmentId,
    departmentName: departments[deptIdx].name,
    slotId: data.slotId,
    date: departments[deptIdx].slots[slotIdx].date,
    time: departments[deptIdx].slots[slotIdx].time,
    citizenName: data.citizenName,
    citizenPhone: data.citizenPhone,
    citizenId: data.citizenId,
    purpose: data.purpose,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
  };

  const bookings = getBookings();
  bookings.unshift(booking);
  setStore('bookings', bookings);
  return { success: true, booking };
}

export function cancelBooking(id) {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const booking = bookings[idx];
  booking.status = 'Cancelled';

  const departments = getDepartments();
  const dept = departments.find((d) => d.id === booking.departmentId);
  if (dept) {
    const slot = dept.slots.find((s) => s.id === booking.slotId);
    if (slot) slot.available = true;
    setStore('queueDepartments', departments);
  }

  setStore('bookings', bookings);
  return booking;
}
