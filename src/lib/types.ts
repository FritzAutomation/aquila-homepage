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
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          name: string
          domain?: string | null
          created_at?: string
          notes?: string | null
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          name?: string
          domain?: string | null
          created_at?: string
          notes?: string | null
          status?: 'active' | 'inactive'
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
          reopened_at: string | null
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
          reopened_at?: string | null
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
          reopened_at?: string | null
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
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          user_type: UserType
          company_id: string | null
          status: UserStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          user_type?: UserType
          company_id?: string | null
          status?: UserStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          user_type?: UserType
          company_id?: string | null
          status?: UserStatus
          created_at?: string
          updated_at?: string
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
      training_modules: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          product: Product
          cover_image: string | null
          sort_order: number
          is_published: boolean
          is_public: boolean
          estimated_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          product: Product
          cover_image?: string | null
          sort_order?: number
          is_published?: boolean
          is_public?: boolean
          estimated_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          product?: Product
          cover_image?: string | null
          sort_order?: number
          is_published?: boolean
          is_public?: boolean
          estimated_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      training_lessons: {
        Row: {
          id: string
          module_id: string
          title: string
          slug: string
          description: string | null
          sort_order: number
          estimated_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          module_id: string
          title: string
          slug: string
          description?: string | null
          sort_order?: number
          estimated_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          title?: string
          slug?: string
          description?: string | null
          sort_order?: number
          estimated_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      training_steps: {
        Row: {
          id: string
          lesson_id: string
          title: string
          step_type: 'content' | 'quiz'
          content: string | null
          video_url: string | null
          sort_order: number
          quiz_question: string | null
          quiz_options: string[] | null
          quiz_correct_index: number | null
          quiz_explanation: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          title: string
          step_type?: 'content' | 'quiz'
          content?: string | null
          video_url?: string | null
          sort_order?: number
          quiz_question?: string | null
          quiz_options?: string[] | null
          quiz_correct_index?: number | null
          quiz_explanation?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          title?: string
          step_type?: 'content' | 'quiz'
          content?: string | null
          video_url?: string | null
          sort_order?: number
          quiz_question?: string | null
          quiz_options?: string[] | null
          quiz_correct_index?: number | null
          quiz_explanation?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      training_assignments: {
        Row: {
          id: string
          user_id: string
          module_id: string
          assigned_by: string | null
          assigned_at: string
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          assigned_by?: string | null
          assigned_at?: string
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          assigned_by?: string | null
          assigned_at?: string
          due_date?: string | null
          created_at?: string
        }
      }
      training_progress: {
        Row: {
          id: string
          user_id: string
          step_id: string
          completed: boolean
          completed_at: string | null
          quiz_answer_index: number | null
          quiz_passed: boolean | null
          attempts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          step_id: string
          completed?: boolean
          completed_at?: string | null
          quiz_answer_index?: number | null
          quiz_passed?: boolean | null
          attempts?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          step_id?: string
          completed?: boolean
          completed_at?: string | null
          quiz_answer_index?: number | null
          quiz_passed?: boolean | null
          attempts?: number
          created_at?: string
          updated_at?: string
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

// Auth & Role types
export type UserType = 'admin' | 'agent' | 'customer'
export type UserStatus = 'invited' | 'active' | 'deactivated'

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

export type Profile = Database['public']['Tables']['profiles']['Row']
/** @deprecated Use Profile instead */
export type StaffProfile = Profile

export type SLAConfig = Database['public']['Tables']['sla_config']['Row']

export type TrainingModule = Database['public']['Tables']['training_modules']['Row']
export type TrainingModuleInsert = Database['public']['Tables']['training_modules']['Insert']
export type TrainingLesson = Database['public']['Tables']['training_lessons']['Row']
export type TrainingLessonInsert = Database['public']['Tables']['training_lessons']['Insert']
export type TrainingStep = Database['public']['Tables']['training_steps']['Row']
export type TrainingStepInsert = Database['public']['Tables']['training_steps']['Insert']
export type TrainingProgress = Database['public']['Tables']['training_progress']['Row']
export type TrainingAssignment = Database['public']['Tables']['training_assignments']['Row']
export type TrainingAssignmentInsert = Database['public']['Tables']['training_assignments']['Insert']

// Training module with nested lessons and steps
export type TrainingModuleWithLessons = TrainingModule & {
  lessons: (TrainingLesson & {
    steps: TrainingStep[]
  })[]
}

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
