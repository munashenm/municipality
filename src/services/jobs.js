import { getStore, setStore, generateId } from './storage';

export const JOB_TYPES = ['Vacancy', 'Tender', 'RFQ', 'Quotation'];

export function getJobs() {
  return getStore('jobs', []);
}

export function getOpenJobs() {
  return getJobs().filter((j) => j.status === 'Open');
}

export function getJob(id) {
  return getJobs().find((j) => j.id === id);
}

export function createJob(data) {
  const jobs = getJobs();
  const job = {
    id: generateId('JOB'),
    ...data,
    status: 'Open',
    applications: [],
    createdAt: new Date().toISOString(),
  };
  jobs.unshift(job);
  setStore('jobs', jobs);
  return job;
}

export function submitApplication(jobId, data) {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx === -1) return { success: false, error: 'Job not found' };

  const application = {
    id: generateId('APP'),
    ...data,
    status: 'Submitted',
    submittedAt: new Date().toISOString(),
    updates: [{ status: 'Submitted', message: 'Application received', date: new Date().toISOString() }],
  };

  jobs[idx].applications.push(application);
  setStore('jobs', jobs);
  return { success: true, application, trackingRef: application.id };
}

export function updateApplicationStatus(jobId, appId, status, message) {
  const jobs = getJobs();
  const jobIdx = jobs.findIndex((j) => j.id === jobId);
  if (jobIdx === -1) return null;

  const appIdx = jobs[jobIdx].applications.findIndex((a) => a.id === appId);
  if (appIdx === -1) return null;

  jobs[jobIdx].applications[appIdx].status = status;
  jobs[jobIdx].applications[appIdx].updates.push({
    status,
    message: message || `Status updated to ${status}`,
    date: new Date().toISOString(),
  });
  setStore('jobs', jobs);
  return jobs[jobIdx].applications[appIdx];
}

export function getApplicationByRef(ref) {
  for (const job of getJobs()) {
    const app = job.applications.find((a) => a.id === ref);
    if (app) return { job, application: app };
  }
  return null;
}
