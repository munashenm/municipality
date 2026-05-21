import { getStore, setStore, generateId } from './storage';

export const NOTICE_CATEGORIES = ['Event', 'Road Closure', 'Community Meeting', 'Public Participation', 'General'];

export function getNotices() {
  return getStore('notices', []);
}

export function createNotice(data) {
  const notices = getNotices();
  const notice = {
    id: generateId('NOT'),
    ...data,
    publishedAt: new Date().toISOString(),
  };
  notices.unshift(notice);
  setStore('notices', notices);
  return notice;
}

export function deleteNotice(id) {
  const notices = getNotices().filter((n) => n.id !== id);
  setStore('notices', notices);
}
