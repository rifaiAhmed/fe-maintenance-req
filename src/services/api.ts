const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:9001/api'
const TOKEN_KEY = 'industrialops_access_token'

interface ApiEnvelope<T> { message: string; data: T; meta?: { page: number; limit: number; total: number; totalPages: number } }

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.status = status }
}

export const session = {
  get token() { return localStorage.getItem(TOKEN_KEY) },
  set(token: string) { localStorage.setItem(TOKEN_KEY, token) },
  clear() { localStorage.removeItem(TOKEN_KEY) },
}

async function request<T>(path: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  if (session.token) headers.set('Authorization', `Bearer ${session.token}`)
  const response = await fetch(`${API_URL}${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({ message: 'Unable to read server response' })) as ApiEnvelope<T>
  if (!response.ok) {
    if (response.status === 401) session.clear()
    throw new ApiError(payload.message || 'Request failed', response.status)
  }
  return payload
}

function queryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== '') search.set(key, String(value)) })
  const result = search.toString()
  return result ? `?${result}` : ''
}

export const api = {
  login: (email: string, password: string) => request<{ token: string; user: ApiUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  me: () => request<ApiUser>('/auth/me'),
  logout: () => request<null>('/auth/logout', { method: 'POST' }),
  dashboard: () => request<{ counts: Record<string, number>; recentRequests: ApiRequest[] }>('/dashboard'),
  requests: (params: Record<string, string | number | undefined> = {}) => request<ApiRequest[]>(`/requests${queryString(params)}`),
  request: (id: string) => request<ApiRequest>(`/requests/${id}`),
  createRequest: (data: { machineId: string; problem: string; priority: string }) => request<ApiRequest>('/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateRequest: (id: string, data: object) => request<ApiRequest>(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  reviewRequest: (id: string, status: string) => request<ApiRequest>(`/requests/${id}/review`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteRequest: (id: string) => request<null>(`/requests/${id}`, { method: 'DELETE' }),
  users: (params: Record<string, string | number | undefined> = {}) => request<ApiUser[]>(`/users${queryString(params)}`),
  user: (id: number) => request<ApiUser>(`/users/${id}`),
  updateUser: (id: number, data: object) => request<ApiUser>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createUser: (data: { name: string; email: string; password: string; role: string; status: string }) => request<ApiUser>('/users', { method: 'POST', body: JSON.stringify(data) }),
}

export interface ApiUser { id: number; name: string; email: string; role: 'Admin' | 'Supervisor' | 'Operator'; status: 'Active' | 'Inactive'; createdAt: string; updatedAt: string }
export interface ApiActivity { id: number; type: 'created' | 'updated' | 'approved' | 'rejected'; title: string; description: string; createdAt: string; actor: ApiUser }
export interface ApiRequest { id: string; machineId: string; problem: string; priority: 'Low' | 'Medium' | 'High' | 'Critical'; status: 'Submitted' | 'Approved' | 'Rejected'; createdBy: ApiUser; reviewedBy?: ApiUser; reviewedAt?: string; technician?: string; targetDate?: string; createdAt: string; updatedAt: string; activities?: ApiActivity[] }
