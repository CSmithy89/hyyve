/**
 * Database Types
 *
 * This file contains the Supabase database type definitions.
 * These types will be generated from the Supabase schema.
 */

// Placeholder database types - will be generated from Supabase schema
export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Utility types for extracting table types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
