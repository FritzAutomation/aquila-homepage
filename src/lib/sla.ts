// SLA calculation utilities

export interface SLAConfig {
  priority: string
  first_response_hours: number
  resolution_hours: number
}

export interface SLAStatus {
  firstResponse: {
    status: 'ok' | 'warning' | 'breached' | 'completed'
    hoursRemaining: number | null
    deadline: Date | null
  }
  resolution: {
    status: 'ok' | 'warning' | 'breached' | 'completed'
    hoursRemaining: number | null
    deadline: Date | null
  }
}

// Default SLA configs if none are set
export const DEFAULT_SLA_CONFIGS: SLAConfig[] = [
  { priority: 'urgent', first_response_hours: 1, resolution_hours: 4 },
  { priority: 'high', first_response_hours: 4, resolution_hours: 24 },
  { priority: 'normal', first_response_hours: 8, resolution_hours: 48 },
  { priority: 'low', first_response_hours: 24, resolution_hours: 72 },
]

// Warning threshold (percentage of SLA time remaining)
const WARNING_THRESHOLD = 0.25 // Warn at 25% time remaining

export function calculateSLAStatus(
  ticket: {
    priority: string
    status: string
    created_at: string
    first_response_at: string | null
    resolved_at: string | null
  },
  slaConfigs: SLAConfig[]
): SLAStatus {
  const config = slaConfigs.find(c => c.priority === ticket.priority)

  if (!config) {
    // No SLA config for this priority
    return {
      firstResponse: { status: 'ok', hoursRemaining: null, deadline: null },
      resolution: { status: 'ok', hoursRemaining: null, deadline: null },
    }
  }

  const createdAt = new Date(ticket.created_at)
  const now = new Date()

  // First Response SLA
  const firstResponseDeadline = new Date(createdAt.getTime() + config.first_response_hours * 60 * 60 * 1000)
  const firstResponseHoursRemaining = (firstResponseDeadline.getTime() - now.getTime()) / (60 * 60 * 1000)

  let firstResponseStatus: 'ok' | 'warning' | 'breached' | 'completed' = 'ok'
  if (ticket.first_response_at) {
    firstResponseStatus = 'completed'
  } else if (firstResponseHoursRemaining <= 0) {
    firstResponseStatus = 'breached'
  } else if (firstResponseHoursRemaining <= config.first_response_hours * WARNING_THRESHOLD) {
    firstResponseStatus = 'warning'
  }

  // Resolution SLA
  const resolutionDeadline = new Date(createdAt.getTime() + config.resolution_hours * 60 * 60 * 1000)
  const resolutionHoursRemaining = (resolutionDeadline.getTime() - now.getTime()) / (60 * 60 * 1000)

  let resolutionStatus: 'ok' | 'warning' | 'breached' | 'completed' = 'ok'
  if (ticket.resolved_at || ticket.status === 'resolved' || ticket.status === 'closed') {
    resolutionStatus = 'completed'
  } else if (resolutionHoursRemaining <= 0) {
    resolutionStatus = 'breached'
  } else if (resolutionHoursRemaining <= config.resolution_hours * WARNING_THRESHOLD) {
    resolutionStatus = 'warning'
  }

  return {
    firstResponse: {
      status: firstResponseStatus,
      hoursRemaining: firstResponseStatus === 'completed' ? null : firstResponseHoursRemaining,
      deadline: firstResponseDeadline,
    },
    resolution: {
      status: resolutionStatus,
      hoursRemaining: resolutionStatus === 'completed' ? null : resolutionHoursRemaining,
      deadline: resolutionDeadline,
    },
  }
}

export function formatTimeRemaining(hours: number): string {
  if (hours < 0) {
    const absHours = Math.abs(hours)
    if (absHours < 1) {
      return `${Math.round(absHours * 60)}m overdue`
    } else if (absHours < 24) {
      return `${Math.round(absHours)}h overdue`
    } else {
      return `${Math.round(absHours / 24)}d overdue`
    }
  }

  if (hours < 1) {
    return `${Math.round(hours * 60)}m left`
  } else if (hours < 24) {
    return `${Math.round(hours)}h left`
  } else {
    return `${Math.round(hours / 24)}d left`
  }
}
