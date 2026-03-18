import config from '../config';

const API = config.api.baseUrl;

async function request(path, options = {}) {
  const url = `${API}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  // TODO: Attach Cognito JWT for admin endpoints
  // const session = await Auth.currentSession();
  // headers.Authorization = session.getIdToken().getJwtToken();

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function createReport(reportData) {
  return request('/reports', {
    method: 'POST',
    body: JSON.stringify(reportData),
  });
}

export function getReport(reportId) {
  return request(`/reports/${reportId}`);
}

export function listReports(status) {
  const query = status ? `?status=${status}` : '';
  return request(`/reports${query}`);
}

export function updateReport(reportId, updates) {
  return request(`/reports/${reportId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export function deleteReport(reportId) {
  return request(`/reports/${reportId}`, { method: 'DELETE' });
}

export function sendReportEmail(reportId) {
  return request(`/reports/${reportId}/send`, { method: 'POST' });
}
