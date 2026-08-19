export type UserRole = 'Admin' | 'Supervisor' | 'Operator'
export type UserStatus = 'Active' | 'Inactive'
export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Critical'
export type RequestStatus = 'Submitted' | 'Approved' | 'Rejected'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  initials: string
  avatarColor: string
  createdAt: string
}

export interface Activity {
  id: number
  title: string
  description: string
  timestamp: string
  type: 'created' | 'approved' | 'rejected' | 'updated'
}

export interface MaintenanceRequest {
  id: string
  machineId: string
  problem: string
  priority: RequestPriority
  status: RequestStatus
  createdBy: string
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
  technician?: string
  targetDate?: string
  activities: Activity[]
}
