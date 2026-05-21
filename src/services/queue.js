import { getStore, setStore, generateId } from './storage';

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
