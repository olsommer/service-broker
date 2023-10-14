export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      billings: {
        Row: {
          amount: number
          carryover: number | null
          created_at: string
          id: string
          job_id: string
          payment_intent: Json | null
          profiles_id: string
          quantity: number | null
          quantity_generated: number | null
        }
        Insert: {
          amount?: number
          carryover?: number | null
          created_at?: string
          id?: string
          job_id: string
          payment_intent?: Json | null
          profiles_id: string
          quantity?: number | null
          quantity_generated?: number | null
        }
        Update: {
          amount?: number
          carryover?: number | null
          created_at?: string
          id?: string
          job_id?: string
          payment_intent?: Json | null
          profiles_id?: string
          quantity?: number | null
          quantity_generated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "billings_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billings_profiles_id_fkey"
            columns: ["profiles_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          deleted: boolean
          file_fields: Json | null
          file_mappings: Json | null
          file_name: string | null
          file_path: string | null
          file_preview: Json | null
          file_size: number | null
          id: string
          name: string | null
          parameters: Json | null
          processed: number | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          file_fields?: Json | null
          file_mappings?: Json | null
          file_name?: string | null
          file_path?: string | null
          file_preview?: Json | null
          file_size?: number | null
          id?: string
          name?: string | null
          parameters?: Json | null
          processed?: number | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          deleted?: boolean
          file_fields?: Json | null
          file_mappings?: Json | null
          file_name?: string | null
          file_path?: string | null
          file_preview?: Json | null
          file_size?: number | null
          id?: string
          name?: string | null
          parameters?: Json | null
          processed?: number | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          campaign_id: string | null
          count_errors: number | null
          count_file_rows: number | null
          count_gen_lines: number | null
          created_at: string
          id: string
          meta: Json
          product: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          count_errors?: number | null
          count_file_rows?: number | null
          count_gen_lines?: number | null
          created_at?: string
          id?: string
          meta?: Json
          product?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          count_errors?: number | null
          count_file_rows?: number | null
          count_gen_lines?: number | null
          created_at?: string
          id?: string
          meta?: Json
          product?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leads: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          lead: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          lead: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          lead?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leads_jobs: {
        Row: {
          campaign_id: string | null
          created_at: string
          id: string
          job_id: string | null
          lead_id: string | null
          meta: string | null
          status: string | null
          status_before: string | null
          tries: number
          updated_at: string | null
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          lead_id?: string | null
          meta?: string | null
          status?: string | null
          status_before?: string | null
          tries?: number
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          id?: string
          job_id?: string | null
          lead_id?: string | null
          meta?: string | null
          status?: string | null
          status_before?: string | null
          tries?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_jobs_campaign_id_fkey"
            columns: ["campaign_id"]
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_jobs_job_id_fkey"
            columns: ["job_id"]
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_jobs_lead_id_fkey"
            columns: ["lead_id"]
            referencedRelation: "leads"
            referencedColumns: ["id"]
          }
        ]
      }
      leads_jobs_logs: {
        Row: {
          created_at: string
          id: string
          meta: Json | null
          ref_id: string | null
          status: string | null
          task: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          meta?: Json | null
          ref_id?: string | null
          status?: string | null
          task?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          meta?: Json | null
          ref_id?: string | null
          status?: string | null
          task?: string | null
        }
        Relationships: []
      }
      lines: {
        Row: {
          active: boolean
          content: string | null
          created_at: string
          id: string
          lead_id: string | null
          lead_job_id: string
          meta: Json | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          content?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          lead_job_id: string
          meta?: Json | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          content?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          lead_job_id?: string
          meta?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lines_lead_id_fkey"
            columns: ["lead_id"]
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lines_lead_job_id_fkey"
            columns: ["lead_job_id"]
            referencedRelation: "leads_jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          comments: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          payment_method_id: string | null
          payment_method_last4: string | null
          status: string | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          payment_method_id?: string | null
          payment_method_last4?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          payment_method_id?: string | null
          payment_method_last4?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ratelimits: {
        Row: {
          credits: number
          id: string
          last_generation: string | null
        }
        Insert: {
          credits: number
          id: string
          last_generation?: string | null
        }
        Update: {
          credits?: number
          id?: string
          last_generation?: string | null
        }
        Relationships: []
      }
      scrapes: {
        Row: {
          content: string | null
          content_cleaned: string | null
          created_at: string
          id: string
          lead_job_id: string | null
          log_callback_url: string | null
          log_request: Json | null
        }
        Insert: {
          content?: string | null
          content_cleaned?: string | null
          created_at?: string
          id?: string
          lead_job_id?: string | null
          log_callback_url?: string | null
          log_request?: Json | null
        }
        Update: {
          content?: string | null
          content_cleaned?: string | null
          created_at?: string
          id?: string
          lead_job_id?: string | null
          log_callback_url?: string | null
          log_request?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "scrapes_lead_job_id_fkey"
            columns: ["lead_job_id"]
            referencedRelation: "leads_jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      summaries: {
        Row: {
          content: string | null
          created_at: string
          id: string
          lead_job_id: string | null
          meta: Json | null
          type: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          lead_job_id?: string | null
          meta?: Json | null
          type?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          lead_job_id?: string | null
          meta?: Json | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "summaries_lead_job_id_fkey"
            columns: ["lead_job_id"]
            referencedRelation: "leads_jobs"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
