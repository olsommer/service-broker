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
          campaign_id: string | null
          carryover: number | null
          created_at: string
          id: string
          job_id: string | null
          payment_intent: Json | null
          payment_intent_id: string | null
          payment_intent_status: string | null
          profiles_id: string
          quantity: number | null
          quantity_generated: number | null
          report_usage_error: Json | null
          report_usage_idempotency_key: string | null
        }
        Insert: {
          amount?: number
          campaign_id?: string | null
          carryover?: number | null
          created_at?: string
          id?: string
          job_id?: string | null
          payment_intent?: Json | null
          payment_intent_id?: string | null
          payment_intent_status?: string | null
          profiles_id: string
          quantity?: number | null
          quantity_generated?: number | null
          report_usage_error?: Json | null
          report_usage_idempotency_key?: string | null
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          carryover?: number | null
          created_at?: string
          id?: string
          job_id?: string | null
          payment_intent?: Json | null
          payment_intent_id?: string | null
          payment_intent_status?: string | null
          profiles_id?: string
          quantity?: number | null
          quantity_generated?: number | null
          report_usage_error?: Json | null
          report_usage_idempotency_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billings_profiles_id_fkey"
            columns: ["profiles_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      jobs: {
        Row: {
          campaign_id: string | null
          count_errors: number
          count_file_rows: number | null
          count_gen_lines: number
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
          count_errors?: number
          count_file_rows?: number | null
          count_gen_lines?: number
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
          count_errors?: number
          count_file_rows?: number | null
          count_gen_lines?: number
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
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      leads_jobs: {
        Row: {
          created_at: string
          id: string
          job_collected: boolean
          job_id: string | null
          lead_id: string | null
          ref_campaign_id: string | null
          status: Database["public"]["Enums"]["job_states"] | null
          status_before: Database["public"]["Enums"]["job_states"] | null
          tries: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_collected?: boolean
          job_id?: string | null
          lead_id?: string | null
          ref_campaign_id?: string | null
          status?: Database["public"]["Enums"]["job_states"] | null
          status_before?: Database["public"]["Enums"]["job_states"] | null
          tries?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_collected?: boolean
          job_id?: string | null
          lead_id?: string | null
          ref_campaign_id?: string | null
          status?: Database["public"]["Enums"]["job_states"] | null
          status_before?: Database["public"]["Enums"]["job_states"] | null
          tries?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_jobs_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
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
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lines_lead_job_id_fkey"
            columns: ["lead_job_id"]
            isOneToOne: false
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
          subscription_id: string | null
          subscription_item_id: string | null
          subscription_valid_to: number | null
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
          subscription_id?: string | null
          subscription_item_id?: string | null
          subscription_valid_to?: number | null
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
          subscription_id?: string | null
          subscription_item_id?: string | null
          subscription_valid_to?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ratelimits: {
        Row: {
          credits: number
          credits_free_tier: number | null
          credits_free_tier_updated_at: string
          id: string
          last_generation: string | null
        }
        Insert: {
          credits: number
          credits_free_tier?: number | null
          credits_free_tier_updated_at?: string
          id: string
          last_generation?: string | null
        }
        Update: {
          credits?: number
          credits_free_tier?: number | null
          credits_free_tier_updated_at?: string
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
            isOneToOne: false
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
            isOneToOne: false
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
      campaign_states: "PAID_JOB_CREATED" | "DRAFT_PARSED" | "DRAFT"
      job_product: "MIX" | "PRO" | "FREE"
      job_states:
        | "OPEN"
        | "FLAG_TO_SCRAPE"
        | "FLAG_TO_SUMMARIZE"
        | "FLAG_TO_GENERATE"
        | "FLAG_TO_FINISH"
        | "DONE"
        | "FLAG_TO_RETRY"
        | "ERROR_TIMEOUT"
        | "ERROR_SCHEDULE_NOT_ALLOWED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
