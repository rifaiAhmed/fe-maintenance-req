import type { MaintenanceRequest, User } from '../types'

export const users: User[] = [
  { id: 1, name: 'Budi Santoso', email: 'budi.s@industrialops.com', role: 'Admin', status: 'Active', initials: 'BS', avatarColor: '#d7e9f8', createdAt: 'Oct 12, 2023' },
  { id: 2, name: 'Andi Pratama', email: 'andi.p@industrialops.com', role: 'Supervisor', status: 'Active', initials: 'AP', avatarColor: '#f4d6b7', createdAt: 'Nov 05, 2023' },
  { id: 3, name: 'Ahmad Fauzi', email: 'ahmad.f@industrialops.com', role: 'Operator', status: 'Inactive', initials: 'AF', avatarColor: '#dfe3e7', createdAt: 'Jan 18, 2024' },
]

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'MR-0001', machineId: 'CNC-Lathe-04', problem: 'Spindle vibration exceeding tolerance during high-speed operation.', priority: 'Critical', status: 'Submitted', createdBy: 'J. Smith', createdAt: 'Oct 24, 08:30', technician: 'Sarah Jenkins (Hydraulics Spec.)', targetDate: '2026-08-24',
    activities: [{ id: 1, title: 'Request Created', description: 'Submitted by J. Smith via Floor Terminal 2.', timestamp: 'Oct 24, 2026 · 08:30', type: 'created' }],
  },
  {
    id: 'MR-0002', machineId: 'PRESS-03', problem: 'Hydraulic pressure drops after 30 minutes of operation. Machine triggers auto-shutoff safety protocol. Requires immediate inspection of main seal and fluid lines.', priority: 'Critical', status: 'Approved', createdBy: 'Budi Santoso', createdAt: 'Oct 23, 14:15', reviewedBy: 'Andi Pratama', reviewedAt: 'Aug 18, 2026', technician: 'Sarah Jenkins (Hydraulics Spec.)', targetDate: '2026-08-25',
    activities: [
      { id: 2, title: 'Request Approved', description: 'System automatically escalated and approved due to Critical status.', timestamp: 'Aug 18, 2026 · 14:30 EST', type: 'approved' },
      { id: 1, title: 'Request Created', description: 'Submitted by Budi Santoso via Floor Terminal 4.', timestamp: 'Aug 18, 2026 · 09:15 EST', type: 'created' },
    ],
  },
  {
    id: 'MR-0003', machineId: 'HVAC-Unit-Roof', problem: 'Filter replacement overdue, restricted airflow detected by monitoring system.', priority: 'Medium', status: 'Rejected', createdBy: 'T. Davis', createdAt: 'Oct 22, 09:45', reviewedBy: 'Andi Pratama', reviewedAt: 'Oct 22, 2026', technician: 'Michael Chen', targetDate: '2026-08-28',
    activities: [
      { id: 2, title: 'Request Rejected', description: 'Duplicate request. Work is already scheduled under MR-0004.', timestamp: 'Oct 22, 2026 · 10:12', type: 'rejected' },
      { id: 1, title: 'Request Created', description: 'Submitted by T. Davis via web portal.', timestamp: 'Oct 22, 2026 · 09:45', type: 'created' },
    ],
  },
]
