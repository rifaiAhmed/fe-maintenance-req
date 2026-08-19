import { computed, reactive } from 'vue'
import { api, session, type ApiRequest, type ApiUser } from '../services/api'
import type { MaintenanceRequest, RequestPriority, User, UserRole, UserStatus } from '../types'

const placeholderUser: User = { id: 0, name: 'User', email: '', role: 'Operator', status: 'Active', initials: 'U', avatarColor: '#d7e9f8', createdAt: '' }
const state = reactive({ requests: [] as MaintenanceRequest[], users: [] as User[], currentUser: placeholderUser, dashboardCounts: { total: 0, submitted: 0, approved: 0, rejected: 0 }, loading: false, initialized: false })
const colors = ['#d7e9f8', '#f4d6b7', '#dfe3e7', '#dff2e4', '#f2e0ee']

function formatDate(value?: string, dateOnly = false) { if (!value) return ''; const date = new Date(value); return new Intl.DateTimeFormat('en-US', dateOnly ? { month: 'short', day: '2-digit', year: 'numeric' } : { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date) }
function toUser(user: ApiUser): User { return { ...user, initials: user.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase(), avatarColor: colors[(user.id - 1) % colors.length] ?? colors[0], createdAt: formatDate(user.createdAt, true) } }
function toRequest(request: ApiRequest): MaintenanceRequest { return { id: request.id, machineId: request.machineId, problem: request.problem, priority: request.priority, status: request.status, createdBy: request.createdBy.name, createdAt: formatDate(request.createdAt), reviewedBy: request.reviewedBy?.name, reviewedAt: formatDate(request.reviewedAt, true), technician: request.technician, targetDate: request.targetDate?.slice(0, 10), activities: (request.activities ?? []).map((activity) => ({ id: activity.id, title: activity.title, description: activity.description, timestamp: formatDate(activity.createdAt), type: activity.type })) } }

export function useAppStore() {
  const requestCount = computed(() => state.requests.length)
  function getRequest(id: string) { return state.requests.find((request) => request.id === id) }
  function getUser(id: number) { return state.users.find((user) => user.id === id) }
  async function initialize(force = false) { if (state.initialized && !force) return; state.loading = true; try { const me = await api.me(); state.currentUser = toUser(me.data); await Promise.all([fetchRequests(), fetchDashboard(), state.currentUser.role === 'Admin' ? fetchUsers() : Promise.resolve()]); state.initialized = true } finally { state.loading = false } }
  async function login(email: string, password: string) { const response = await api.login(email, password); session.set(response.data.token); state.currentUser = toUser(response.data.user); state.initialized = false; await initialize(true) }
  async function logout() { try { await api.logout() } finally { session.clear(); state.initialized = false; state.requests = []; state.users = [] } }
  async function fetchRequests(params: Record<string, string | number | undefined> = {}) { const response = await api.requests({ limit: 100, ...params }); state.requests = response.data.map(toRequest) }
  async function fetchDashboard() { const response = await api.dashboard(); state.dashboardCounts = { total: response.data.counts.total ?? 0, submitted: response.data.counts.submitted ?? 0, approved: response.data.counts.approved ?? 0, rejected: response.data.counts.rejected ?? 0 } }
  async function fetchUsers(params: Record<string, string | number | undefined> = {}) { const response = await api.users({ limit: 100, ...params }); state.users = response.data.map(toUser) }
  async function fetchRequest(id: string) { const response = await api.request(id); const mapped = toRequest(response.data); const index = state.requests.findIndex((item) => item.id === id); if (index >= 0) state.requests[index] = mapped; else state.requests.push(mapped); return mapped }
  async function fetchUser(id: number) { const response = await api.user(id); const mapped = toUser(response.data); const index = state.users.findIndex((item) => item.id === id); if (index >= 0) state.users[index] = mapped; else state.users.push(mapped); return mapped }
  async function addRequest(payload: { machineId: string; problem: string; priority: RequestPriority }) { const response = await api.createRequest(payload); const request = toRequest(response.data); state.requests.unshift(request); await fetchDashboard(); return request }
  async function updateRequest(id: string, updates: Partial<MaintenanceRequest>) { const response = await api.updateRequest(id, { machineId: updates.machineId, problem: updates.problem, priority: updates.priority, technician: updates.technician, targetDate: updates.targetDate || null }); const request = toRequest(response.data); const index = state.requests.findIndex((item) => item.id === id); if (index >= 0) state.requests[index] = request; return request }
  async function reviewRequest(id: string, status: 'Approved' | 'Rejected') { const response = await api.reviewRequest(id, status); const request = toRequest(response.data); const index = state.requests.findIndex((item) => item.id === id); if (index >= 0) state.requests[index] = request; await fetchDashboard() }
  async function deleteRequest(id: string) { await api.deleteRequest(id); state.requests = state.requests.filter((request) => request.id !== id); await fetchDashboard() }
  async function updateUser(id: number, updates: Partial<User>) { const response = await api.updateUser(id, updates); const user = toUser(response.data); const index = state.users.findIndex((item) => item.id === id); if (index >= 0) state.users[index] = user }
  async function createUser(payload: { name: string; email: string; password: string; role: UserRole; status: UserStatus }) { const response = await api.createUser(payload); const user = toUser(response.data); state.users.push(user); return user }
  return { state, requestCount, getRequest, getUser, initialize, login, logout, fetchRequests, fetchRequest, fetchUsers, fetchUser, addRequest, updateRequest, reviewRequest, deleteRequest, updateUser, createUser }
}
