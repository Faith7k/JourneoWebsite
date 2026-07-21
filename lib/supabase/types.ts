export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          role: 'admin' | 'user';
          created_at: string;
          last_seen_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          role?: 'admin' | 'user';
          created_at?: string;
          last_seen_at?: string | null;
        };
        Update: Partial<ProfilesInsert>;
      };
      screenshots: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          alt_text: string | null;
          image_url: string;
          storage_path: string | null;
          icon: string | null;
          color_theme: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          alt_text?: string | null;
          image_url: string;
          storage_path?: string | null;
          icon?: string | null;
          color_theme?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<ScreenshotsInsert>;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          locale: string | null;
          user_agent: string | null;
          ip_hash: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          locale?: string | null;
          user_agent?: string | null;
          ip_hash?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: Partial<ContactMessagesInsert>;
      };
      api_usage: {
        Row: {
          id: string;
          endpoint: string;
          method: string;
          user_id: string | null;
          app_version: string | null;
          platform: 'ios' | 'android' | 'web' | null;
          status_code: number;
          duration_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          endpoint: string;
          method: string;
          user_id?: string | null;
          app_version?: string | null;
          platform?: 'ios' | 'android' | 'web' | null;
          status_code: number;
          duration_ms?: number | null;
          created_at?: string;
        };
        Update: Partial<ApiUsageInsert>;
      };
      app_users: {
        Row: {
          id: string;
          email: string | null;
          platform: 'ios' | 'android' | null;
          app_version: string | null;
          locale: string | null;
          country: string | null;
          subscription: 'free' | 'premium' | null;
          is_active: boolean;
          last_active_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          platform?: 'ios' | 'android' | null;
          app_version?: string | null;
          locale?: string | null;
          country?: string | null;
          subscription?: 'free' | 'premium' | null;
          is_active?: boolean;
          last_active_at?: string | null;
          created_at?: string;
        };
        Update: Partial<AppUsersInsert>;
      };
      site_settings: {
        Row: {
          id: string;
          app_store_url: string | null;
          play_store_url: string | null;
          support_email: string | null;
          press_email: string | null;
          phone: string | null;
          address: string | null;
          twitter_url: string | null;
          instagram_url: string | null;
          linkedin_url: string | null;
          privacy_policy_url: string | null;
          terms_of_service_url: string | null;
          privacy_policy_text_tr: string | null;
          privacy_policy_text_en: string | null;
          terms_of_service_text_tr: string | null;
          terms_of_service_text_en: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          app_store_url?: string | null;
          play_store_url?: string | null;
          support_email?: string | null;
          press_email?: string | null;
          phone?: string | null;
          address?: string | null;
          twitter_url?: string | null;
          instagram_url?: string | null;
          linkedin_url?: string | null;
          privacy_policy_url?: string | null;
          terms_of_service_url?: string | null;
          privacy_policy_text_tr?: string | null;
          privacy_policy_text_en?: string | null;
          terms_of_service_text_tr?: string | null;
          terms_of_service_text_en?: string | null;
          updated_at?: string;
        };
        Update: Partial<SiteSettingsInsert>;
      };
    };
  };
};

export type Profiles = Database['public']['Tables']['profiles']['Row'];
export type ProfilesInsert = Database['public']['Tables']['profiles']['Insert'];
export type Screenshots = Database['public']['Tables']['screenshots']['Row'];
export type ScreenshotsInsert = Database['public']['Tables']['screenshots']['Insert'];
export type ContactMessages = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessagesInsert = Database['public']['Tables']['contact_messages']['Insert'];
export type ApiUsage = Database['public']['Tables']['api_usage']['Row'];
export type ApiUsageInsert = Database['public']['Tables']['api_usage']['Insert'];
export type AppUsers = Database['public']['Tables']['app_users']['Row'];
export type AppUsersInsert = Database['public']['Tables']['app_users']['Insert'];
export type SiteSettings = Database['public']['Tables']['site_settings']['Row'];
export type SiteSettingsInsert = Database['public']['Tables']['site_settings']['Insert'];
