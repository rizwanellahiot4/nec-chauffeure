export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_reference: string
          child_seat: boolean
          child_seat_type: string
          created_at: string
          created_by: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          dropoff_address: string
          dropoff_lat: number
          dropoff_lng: number
          duration_hours: number
          id: string
          luggage: number
          notes: string
          passengers: number
          payment_status: string
          pickup_address: string
          pickup_at: string
          pickup_lat: number
          pickup_lng: number
          route_distance_km: number
          route_duration_minutes: number
          route_geometry: Json
          service_type: string
          status: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          total_price: number
          updated_at: string
          vehicle_id: string | null
          vehicle_name_snapshot: string
        }
        Insert: {
          booking_reference?: string
          child_seat?: boolean
          child_seat_type?: string
          created_at?: string
          created_by?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          dropoff_address: string
          dropoff_lat: number
          dropoff_lng: number
          duration_hours?: number
          id?: string
          luggage: number
          notes?: string
          passengers: number
          payment_status?: string
          pickup_address: string
          pickup_at: string
          pickup_lat: number
          pickup_lng: number
          route_distance_km: number
          route_duration_minutes: number
          route_geometry?: Json
          service_type: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          total_price: number
          updated_at?: string
          vehicle_id?: string | null
          vehicle_name_snapshot: string
        }
        Update: {
          booking_reference?: string
          child_seat?: boolean
          child_seat_type?: string
          created_at?: string
          created_by?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          dropoff_address?: string
          dropoff_lat?: number
          dropoff_lng?: number
          duration_hours?: number
          id?: string
          luggage?: number
          notes?: string
          passengers?: number
          payment_status?: string
          pickup_address?: string
          pickup_at?: string
          pickup_lat?: number
          pickup_lng?: number
          route_distance_km?: number
          route_duration_minutes?: number
          route_geometry?: Json
          service_type?: string
          status?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          total_price?: number
          updated_at?: string
          vehicle_id?: string | null
          vehicle_name_snapshot?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_settings: {
        Row: {
          background_color: string
          border_color: string
          business_address: string
          business_email: string
          business_logo_url: string | null
          business_name: string
          business_phone: string
          card_color: string
          created_at: string
          footer_copyright_text: string
          foreground_color: string
          id: string
          muted_color: string
          primary_brand_color: string
          secondary_brand_color: string
          updated_at: string
        }
        Insert: {
          background_color?: string
          border_color?: string
          business_address: string
          business_email: string
          business_logo_url?: string | null
          business_name: string
          business_phone: string
          card_color?: string
          created_at?: string
          footer_copyright_text: string
          foreground_color?: string
          id?: string
          muted_color?: string
          primary_brand_color: string
          secondary_brand_color: string
          updated_at?: string
        }
        Update: {
          background_color?: string
          border_color?: string
          business_address?: string
          business_email?: string
          business_logo_url?: string | null
          business_name?: string
          business_phone?: string
          card_color?: string
          created_at?: string
          footer_copyright_text?: string
          foreground_color?: string
          id?: string
          muted_color?: string
          primary_brand_color?: string
          secondary_brand_color?: string
          updated_at?: string
        }
        Relationships: []
      }
      map_settings: {
        Row: {
          center_lat: number
          center_lng: number
          country_code: string
          created_at: string
          id: string
          updated_at: string
          zoom: number
        }
        Insert: {
          center_lat?: number
          center_lng?: number
          country_code?: string
          created_at?: string
          id?: string
          updated_at?: string
          zoom?: number
        }
        Update: {
          center_lat?: number
          center_lng?: number
          country_code?: string
          created_at?: string
          id?: string
          updated_at?: string
          zoom?: number
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          checkout_cancel_path: string
          checkout_success_path: string
          created_at: string
          id: string
          mode: string
          publishable_key: string | null
          updated_at: string
          webhook_endpoint_path: string
        }
        Insert: {
          checkout_cancel_path?: string
          checkout_success_path?: string
          created_at?: string
          id?: string
          mode?: string
          publishable_key?: string | null
          updated_at?: string
          webhook_endpoint_path?: string
        }
        Update: {
          checkout_cancel_path?: string
          checkout_success_path?: string
          created_at?: string
          id?: string
          mode?: string
          publishable_key?: string | null
          updated_at?: string
          webhook_endpoint_path?: string
        }
        Relationships: []
      }
      pricing_settings: {
        Row: {
          airport_surcharge: number
          base_fare: number
          booster_seat_price: number
          child_seat_price: number
          created_at: string
          distance_unit: string
          forward_facing_seat_price: number
          from_airport_surcharge: number
          hourly_chauffeur_base_fare: number
          hourly_distance_unit: string
          hourly_rate: number
          id: string
          price_per_km: number
          private_tour_base_fare: number
          rear_facing_seat_price: number
          to_airport_surcharge: number
          updated_at: string
        }
        Insert: {
          airport_surcharge?: number
          base_fare?: number
          booster_seat_price?: number
          child_seat_price?: number
          created_at?: string
          distance_unit?: string
          forward_facing_seat_price?: number
          from_airport_surcharge?: number
          hourly_chauffeur_base_fare?: number
          hourly_distance_unit?: string
          hourly_rate?: number
          id?: string
          price_per_km?: number
          private_tour_base_fare?: number
          rear_facing_seat_price?: number
          to_airport_surcharge?: number
          updated_at?: string
        }
        Update: {
          airport_surcharge?: number
          base_fare?: number
          booster_seat_price?: number
          child_seat_price?: number
          created_at?: string
          distance_unit?: string
          forward_facing_seat_price?: number
          from_airport_surcharge?: number
          hourly_chauffeur_base_fare?: number
          hourly_distance_unit?: string
          hourly_rate?: number
          id?: string
          price_per_km?: number
          private_tour_base_fare?: number
          rear_facing_seat_price?: number
          to_airport_surcharge?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          booster_seat_price: number
          created_at: string
          description: string
          forward_facing_seat_price: number
          hourly_rate: number
          id: string
          image: string
          is_active: boolean
          luggage: number
          minimum_fare: number
          name: string
          passengers: number
          price_multiplier: number
          price_per_mile: number
          private_tour_price: number
          rear_facing_seat_price: number
          updated_at: string
        }
        Insert: {
          booster_seat_price?: number
          created_at?: string
          description?: string
          forward_facing_seat_price?: number
          hourly_rate?: number
          id?: string
          image: string
          is_active?: boolean
          luggage: number
          minimum_fare?: number
          name: string
          passengers: number
          price_multiplier?: number
          price_per_mile?: number
          private_tour_price?: number
          rear_facing_seat_price?: number
          updated_at?: string
        }
        Update: {
          booster_seat_price?: number
          created_at?: string
          description?: string
          forward_facing_seat_price?: number
          hourly_rate?: number
          id?: string
          image?: string
          is_active?: boolean
          luggage?: number
          minimum_fare?: number
          name?: string
          passengers?: number
          price_multiplier?: number
          price_per_mile?: number
          private_tour_price?: number
          rear_facing_seat_price?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
