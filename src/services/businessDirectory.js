import { getStore, setStore, generateId } from './storage';
import { logAudit } from './audit';

export const BUSINESS_CATEGORIES = [
  'All',
  'Retail & Shopping',
  'Food & Restaurants',
  'Professional Services',
  'Trades & Construction',
  'Health & Wellness',
  'Automotive',
  'Agriculture',
  'Tourism & Hospitality',
  'Other',
];

export function getBusinesses() {
  return getStore('businesses', []);
}

export function getPublishedBusinesses() {
  return getBusinesses().filter((b) => b.status === 'Published');
}

export function getBusiness(id) {
  return getBusinesses().find((b) => b.id === id);
}

export function createBusiness(data) {
  const businesses = getBusinesses();
  const business = {
    id: generateId('BIZ'),
    ...data,
    status: data.status || 'Published',
    createdAt: new Date().toISOString(),
  };
  businesses.unshift(business);
  setStore('businesses', businesses);
  logAudit('business_listed', { name: business.name, category: business.category });
  return business;
}

export function updateBusiness(id, data) {
  const businesses = getBusinesses();
  const idx = businesses.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  businesses[idx] = { ...businesses[idx], ...data, updatedAt: new Date().toISOString() };
  setStore('businesses', businesses);
  return businesses[idx];
}

export function deleteBusiness(id) {
  setStore('businesses', getBusinesses().filter((b) => b.id !== id));
}

export function searchBusinesses(query, category = 'All') {
  const q = query.trim().toLowerCase();
  return getPublishedBusinesses().filter((b) => {
    const matchCategory = category === 'All' || b.category === category;
    const matchQuery = !q || [
      b.name, b.category, b.description, b.address, b.ward, b.phone,
    ].some((field) => field?.toLowerCase().includes(q));
    return matchCategory && matchQuery;
  });
}
