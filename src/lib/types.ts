// Database types for Supabase
export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          domain: string | null
          created_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          created_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          created_at?: string
          notes?: string | null
        }
      }
      tickets: {
        Row: {
          id: string
          ticket_number: number
          company_id: string | null
          email: string
          name: string | null
          phone: string | null
          product: Product
          issue_type: IssueType
          status: TicketStatus
          priority: Priority
          created_at: string
          first_response_at: string | null
          resolved_at: string | null
          closed_at: string | null
          assigned_to: string | null
          subject: string
          source: 'web' | 'email'
        }
        Insert: {
          id?: string
          ticket_number?: number
          company_id?: string | null
          email: string
          name?: string | null
          phone?: string | null
          product: Product
          issue_type: IssueType
          status?: TicketStatus
          priority?: Priority
          created_at?: string
          first_response_at?: string | null
          resolved_at?: string | null
          closed_at?: string | null
          assigned_to?: string | null
          subject: string
          source?: 'web' | 'email'
        }
        Update: {
          id?: string
          ticket_number?: number
          company_id?: string | null
          email?: string
          name?: string | null
          phone?: string | null
          product?: Product
          issue_type?: IssueType
          status?: TicketStatus
          priority?: Priority
          created_at?: string
          first_response_at?: string | null
          resolved_at?: string | null
          closed_at?: string | null
          assigned_to?: string | null
          subject?: string
          source?: 'web' | 'email'
        }
      }
      messages: {
        Row: {
          id: string
          ticket_id: string
          content: string
          sender_type: 'customer' | 'agent' | 'system'
          sender_email: string | null
          sender_name: string | null
          created_at: string
          email_message_id: string | null
          attachments: unknown[]
          is_internal: boolean
        }
        Insert: {
          id?: string
          ticket_id: string
          content: string
          sender_type: 'customer' | 'agent' | 'system'
          sender_email?: string | null
          sender_name?: string | null
          created_at?: string
          email_message_id?: string | null
          attachments?: unknown[]
          is_internal?: boolean
        }
        Update: {
          id?: string
          ticket_id?: string
          content?: string
          sender_type?: 'customer' | 'agent' | 'system'
          sender_email?: string | null
          sender_name?: string | null
          created_at?: string
          email_message_id?: string | null
          attachments?: unknown[]
          is_internal?: boolean
        }
      }
      staff_profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'agent' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: 'agent' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'agent' | 'admin'
          created_at?: string
        }
      }
      sla_config: {
        Row: {
          id: string
          priority: string
          first_response_hours: number
          resolution_hours: number
        }
        Insert: {
          id?: string
          priority: string
          first_response_hours: number
          resolution_hours: number
        }
        Update: {
          id?: string
          priority?: string
          first_response_hours?: number
          resolution_hours?: number
        }
      }
    }
    Views: {
      company_monthly_stats: {
        Row: {
          company_id: string | null
          month: string | null
          total_tickets: number | null
          closed_tickets: number | null
          avg_first_response_hours: number | null
          avg_resolution_hours: number | null
          dmm_tickets: number | null
          greenlight_tickets: number | null
          custom_tickets: number | null
          bug_tickets: number | null
          feature_requests: number | null
          training_tickets: number | null
          integration_tickets: number | null
        }
      }
      sla_compliance: {
        Row: {
          id: string | null
          ticket_number: number | null
          company_id: string | null
          priority: string | null
          created_at: string | null
          sla_response_hours: number | null
          sla_resolution_hours: number | null
          actual_response_hours: number | null
          actual_resolution_hours: number | null
          response_sla_met: boolean | null
          resolution_sla_met: boolean | null
        }
      }
      ticket_stats: {
        Row: {
          total_tickets: number | null
          open_tickets: number | null
          in_progress_tickets: number | null
          pending_tickets: number | null
          resolved_tickets: number | null
          closed_tickets: number | null
          avg_response_hours: number | null
          avg_resolution_hours: number | null
        }
      }
    }
  }
}

// Enum types
export type Product = 'dmm' | 'green-light' | 'custom' | 'general'
export type IssueType = 'bug' | 'feature' | 'training' | 'integration' | 'billing' | 'other'
export type TicketStatus = 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed'
export type Priority = 'low' | 'normal' | 'high' | 'urgent'

// Convenience types
export type Ticket = Database['public']['Tables']['tickets']['Row']
export type TicketInsert = Database['public']['Tables']['tickets']['Insert']
export type TicketUpdate = Database['public']['Tables']['tickets']['Update']

export type Message = Database['public']['Tables']['messages']['Row']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']

export type Company = Database['public']['Tables']['companies']['Row']
export type CompanyInsert = Database['public']['Tables']['companies']['Insert']

export type StaffProfile = Database['public']['Tables']['staff_profiles']['Row']

export type SLAConfig = Database['public']['Tables']['sla_config']['Row']

// Ticket with messages for detail view
export type TicketWithMessages = Ticket & {
  messages: Message[]
  company: Company | null
}

// API Response types
export type ApiResponse<T> = {
  data?: T
  error?: string
}

// Product and Issue Type labels for UI
export const PRODUCT_LABELS: Record<Product, string> = {
  'dmm': 'DMM System',
  'green-light': 'Green Light Monitoring',
  'custom': 'Custom Solutions',
  'general': 'General'
}

export const ISSUE_TYPE_LABELS: Record<IssueType, string> = {
  'bug': 'Bug Report',
  'feature': 'Feature Request',
  'training': 'Training Request',
  'integration': 'Integration Help',
  'billing': 'Billing Question',
  'other': 'Other'
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  'open': 'Open',
  'pending': 'Pending',
  'in_progress': 'In Progress',
  'resolved': 'Resolved',
  'closed': 'Closed'
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  'low': 'Low',
  'normal': 'Normal',
  'high': 'High',
  'urgent': 'Urgent'
}
