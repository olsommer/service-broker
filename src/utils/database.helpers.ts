import { Database } from "./database.types";

// supabase gen types typescript --linked > functions/_shared/database.types.ts
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
