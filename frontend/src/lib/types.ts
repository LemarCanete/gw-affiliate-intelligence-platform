export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      content_assets: {
        Row: {
          body: string | null
          brief_id: string | null
          clicks: number | null
          created_at: string | null
          faq_count: number | null
          format: Database["public"]["Enums"]["content_format"]
          id: string
          intent: Database["public"]["Enums"]["content_intent"] | null
          platform: Database["public"]["Enums"]["platform"] | null
          product_id: string
          published_at: string | null
          revenue: number | null
          status: Database["public"]["Enums"]["publish_status"]
          title: string
          url: string | null
          user_id: string
          views: number | null
          word_count: number | null
        }
        Insert: {
          body?: string | null
          brief_id?: string | null
          clicks?: number | null
          created_at?: string | null
          faq_count?: number | null
          format: Database["public"]["Enums"]["content_format"]
          id?: string
          intent?: Database["public"]["Enums"]["content_intent"] | null
          platform?: Database["public"]["Enums"]["platform"] | null
          product_id: string
          published_at?: string | null
          revenue?: number | null
          status?: Database["public"]["Enums"]["publish_status"]
          title: string
          url?: string | null
          user_id: string
          views?: number | null
          word_count?: number | null
        }
        Update: {
          body?: string | null
          brief_id?: string | null
          clicks?: number | null
          created_at?: string | null
          faq_count?: number | null
          format?: Database["public"]["Enums"]["content_format"]
          id?: string
          intent?: Database["public"]["Enums"]["content_intent"] | null
          platform?: Database["public"]["Enums"]["platform"] | null
          product_id?: string
          published_at?: string | null
          revenue?: number | null
          status?: Database["public"]["Enums"]["publish_status"]
          title?: string
          url?: string | null
          user_id?: string
          views?: number | null
          word_count?: number | null
        }
        Relationships: []
      }
      content_briefs: {
        Row: {
          affiliate_link: string | null
          created_at: string | null
          google_landscape: string | null
          id: string
          intent: Database["public"]["Enums"]["content_intent"]
          llm_current_answer: string | null
          product_id: string
          status: string
          structure_outline: string[] | null
          target_query: string
          updated_at: string | null
          user_id: string
          word_count: number | null
        }
        Insert: {
          affiliate_link?: string | null
          created_at?: string | null
          google_landscape?: string | null
          id?: string
          intent: Database["public"]["Enums"]["content_intent"]
          llm_current_answer?: string | null
          product_id: string
          status?: string
          structure_outline?: string[] | null
          target_query: string
          updated_at?: string | null
          user_id: string
          word_count?: number | null
        }
        Update: {
          affiliate_link?: string | null
          created_at?: string | null
          google_landscape?: string | null
          id?: string
          intent?: Database["public"]["Enums"]["content_intent"]
          llm_current_answer?: string | null
          product_id?: string
          status?: string
          structure_outline?: string[] | null
          target_query?: string
          updated_at?: string | null
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      feeds: {
        Row: {
          avg_score: number | null
          config: Json | null
          created_at: string | null
          error_message: string | null
          health: Database["public"]["Enums"]["feed_health"]
          id: string
          items_discovered: number | null
          items_this_week: number | null
          last_run: string | null
          name: string
          next_run: string | null
          type: Database["public"]["Enums"]["feed_type"]
          user_id: string
        }
        Insert: {
          avg_score?: number | null
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          health?: Database["public"]["Enums"]["feed_health"]
          id?: string
          items_discovered?: number | null
          items_this_week?: number | null
          last_run?: string | null
          name: string
          next_run?: string | null
          type: Database["public"]["Enums"]["feed_type"]
          user_id: string
        }
        Update: {
          avg_score?: number | null
          config?: Json | null
          created_at?: string | null
          error_message?: string | null
          health?: Database["public"]["Enums"]["feed_health"]
          id?: string
          items_discovered?: number | null
          items_this_week?: number | null
          last_run?: string | null
          name?: string
          next_run?: string | null
          type?: Database["public"]["Enums"]["feed_type"]
          user_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          status: string
          stripe_invoice_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          stripe_invoice_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      llm_test_results: {
        Row: {
          cited_sources: string[] | null
          classification_prompt: string | null
          engine: Database["public"]["Enums"]["llm_engine"]
          id: string
          product_id: string
          query: string
          raw_response: string | null
          response_type: Database["public"]["Enums"]["llm_response_type"] | null
          tested_at: string | null
        }
        Insert: {
          cited_sources?: string[] | null
          classification_prompt?: string | null
          engine: Database["public"]["Enums"]["llm_engine"]
          id?: string
          product_id: string
          query: string
          raw_response?: string | null
          response_type?: Database["public"]["Enums"]["llm_response_type"] | null
          tested_at?: string | null
        }
        Update: {
          cited_sources?: string[] | null
          classification_prompt?: string | null
          engine?: Database["public"]["Enums"]["llm_engine"]
          id?: string
          product_id?: string
          query?: string
          raw_response?: string | null
          response_type?: Database["public"]["Enums"]["llm_response_type"] | null
          tested_at?: string | null
        }
        Relationships: []
      }
      monitoring_checks: {
        Row: {
          check_type: string
          checked_at: string | null
          citation_excerpt: string | null
          citation_url: string | null
          content_asset_id: string | null
          engine: Database["public"]["Enums"]["llm_engine"]
          id: string
          is_cited: boolean | null
          product_id: string
          query: string
          raw_response: string | null
          scheduled_for: string | null
        }
        Insert: {
          check_type: string
          checked_at?: string | null
          citation_excerpt?: string | null
          citation_url?: string | null
          content_asset_id?: string | null
          engine: Database["public"]["Enums"]["llm_engine"]
          id?: string
          is_cited?: boolean | null
          product_id: string
          query: string
          raw_response?: string | null
          scheduled_for?: string | null
        }
        Update: {
          check_type?: string
          checked_at?: string | null
          citation_excerpt?: string | null
          citation_url?: string | null
          content_asset_id?: string | null
          engine?: Database["public"]["Enums"]["llm_engine"]
          id?: string
          is_cited?: boolean | null
          product_id?: string
          query?: string
          raw_response?: string | null
          scheduled_for?: string | null
        }
        Relationships: []
      }
      neuronwriter_scores: {
        Row: {
          content_asset_id: string
          content_score: number | null
          flagged_for_review: boolean | null
          id: string
          neuronwriter_query_id: string | null
          optimisation_pass: number | null
          paa_questions: Json | null
          scored_at: string | null
          semantic_terms: Json | null
          target_word_count: number | null
        }
        Insert: {
          content_asset_id: string
          content_score?: number | null
          flagged_for_review?: boolean | null
          id?: string
          neuronwriter_query_id?: string | null
          optimisation_pass?: number | null
          paa_questions?: Json | null
          scored_at?: string | null
          semantic_terms?: Json | null
          target_word_count?: number | null
        }
        Update: {
          content_asset_id?: string
          content_score?: number | null
          flagged_for_review?: boolean | null
          id?: string
          neuronwriter_query_id?: string | null
          optimisation_pass?: number | null
          paa_questions?: Json | null
          scored_at?: string | null
          semantic_terms?: Json | null
          target_word_count?: number | null
        }
        Relationships: []
      }
      product_scores: {
        Row: {
          affiliate_available: number
          buying_intent: number
          google_gap_strength: number
          id: string
          llm_gap_strength: number
          notes: string | null
          product_id: string
          product_newness: number
          scored_at: string | null
          total: number | null
        }
        Insert: {
          affiliate_available: number
          buying_intent: number
          google_gap_strength: number
          id?: string
          llm_gap_strength: number
          notes?: string | null
          product_id: string
          product_newness: number
          scored_at?: string | null
          total?: number | null
        }
        Update: {
          affiliate_available?: number
          buying_intent?: number
          google_gap_strength?: number
          id?: string
          llm_gap_strength?: number
          notes?: string | null
          product_id?: string
          product_newness?: number
          scored_at?: string | null
          total?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          affiliate_commission: string | null
          affiliate_cookie_duration: string | null
          affiliate_network: string | null
          affiliate_payment_terms: string | null
          affiliate_url: string | null
          category: string | null
          created_at: string | null
          description: string | null
          discovered_at: string | null
          gap_status: Database["public"]["Enums"]["gap_status"] | null
          geo_score: number | null
          id: string
          intent: Database["public"]["Enums"]["content_intent"] | null
          last_updated: string | null
          launched_at: string | null
          name: string
          product_url: string | null
          revenue: number | null
          serp_position: number | null
          source: Database["public"]["Enums"]["feed_type"] | null
          status: Database["public"]["Enums"]["publish_status"]
          user_id: string
          verdict: Database["public"]["Enums"]["gap_verdict"] | null
        }
        Insert: {
          affiliate_commission?: string | null
          affiliate_cookie_duration?: string | null
          affiliate_network?: string | null
          affiliate_payment_terms?: string | null
          affiliate_url?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          discovered_at?: string | null
          gap_status?: Database["public"]["Enums"]["gap_status"] | null
          geo_score?: number | null
          id?: string
          intent?: Database["public"]["Enums"]["content_intent"] | null
          last_updated?: string | null
          launched_at?: string | null
          name: string
          product_url?: string | null
          revenue?: number | null
          serp_position?: number | null
          source?: Database["public"]["Enums"]["feed_type"] | null
          status?: Database["public"]["Enums"]["publish_status"]
          user_id: string
          verdict?: Database["public"]["Enums"]["gap_verdict"] | null
        }
        Update: {
          affiliate_commission?: string | null
          affiliate_cookie_duration?: string | null
          affiliate_network?: string | null
          affiliate_payment_terms?: string | null
          affiliate_url?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          discovered_at?: string | null
          gap_status?: Database["public"]["Enums"]["gap_status"] | null
          geo_score?: number | null
          id?: string
          intent?: Database["public"]["Enums"]["content_intent"] | null
          last_updated?: string | null
          launched_at?: string | null
          name?: string
          product_url?: string | null
          revenue?: number | null
          serp_position?: number | null
          source?: Database["public"]["Enums"]["feed_type"] | null
          status?: Database["public"]["Enums"]["publish_status"]
          user_id?: string
          verdict?: Database["public"]["Enums"]["gap_verdict"] | null
        }
        Relationships: []
      }
      publish_records: {
        Row: {
          affiliate_disclosure_present: boolean | null
          affiliate_links_count: number | null
          affiliate_url_used: string | null
          content_asset_id: string
          created_at: string | null
          faq_count: number | null
          focus_keyword: string | null
          gsc_indexing_requested: boolean | null
          gsc_indexing_response: Json | null
          id: string
          internal_links_added: number | null
          meta_description: string | null
          meta_title: string | null
          post_status: string | null
          published_at: string | null
          published_url: string | null
          schemas_applied: string[] | null
          seo_checks_passed: number | null
          seo_checks_total: number | null
          seo_plugin: string | null
          sitemap_pinged: boolean | null
          slug: string | null
          user_id: string
          validation_warnings: string[] | null
          word_count: number | null
          wordpress_post_id: number | null
        }
        Insert: {
          affiliate_disclosure_present?: boolean | null
          affiliate_links_count?: number | null
          affiliate_url_used?: string | null
          content_asset_id: string
          created_at?: string | null
          faq_count?: number | null
          focus_keyword?: string | null
          gsc_indexing_requested?: boolean | null
          gsc_indexing_response?: Json | null
          id?: string
          internal_links_added?: number | null
          meta_description?: string | null
          meta_title?: string | null
          post_status?: string | null
          published_at?: string | null
          published_url?: string | null
          schemas_applied?: string[] | null
          seo_checks_passed?: number | null
          seo_checks_total?: number | null
          seo_plugin?: string | null
          sitemap_pinged?: boolean | null
          slug?: string | null
          user_id: string
          validation_warnings?: string[] | null
          word_count?: number | null
          wordpress_post_id?: number | null
        }
        Update: {
          affiliate_disclosure_present?: boolean | null
          affiliate_links_count?: number | null
          affiliate_url_used?: string | null
          content_asset_id?: string
          created_at?: string | null
          faq_count?: number | null
          focus_keyword?: string | null
          gsc_indexing_requested?: boolean | null
          gsc_indexing_response?: Json | null
          id?: string
          internal_links_added?: number | null
          meta_description?: string | null
          meta_title?: string | null
          post_status?: string | null
          published_at?: string | null
          published_url?: string | null
          schemas_applied?: string[] | null
          seo_checks_passed?: number | null
          seo_checks_total?: number | null
          seo_plugin?: string | null
          sitemap_pinged?: boolean | null
          slug?: string | null
          user_id?: string
          validation_warnings?: string[] | null
          word_count?: number | null
          wordpress_post_id?: number | null
        }
        Relationships: []
      }
      refresh_alerts: {
        Row: {
          action_required: string | null
          content_url: string | null
          description: string | null
          detected_at: string | null
          id: string
          metric_after: string | null
          metric_before: string | null
          metric_label: string | null
          product_id: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["refresh_severity"]
          status: string
          title: string
          trigger_type: Database["public"]["Enums"]["refresh_trigger_type"]
          user_id: string
        }
        Insert: {
          action_required?: string | null
          content_url?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          metric_after?: string | null
          metric_before?: string | null
          metric_label?: string | null
          product_id: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["refresh_severity"]
          status?: string
          title: string
          trigger_type: Database["public"]["Enums"]["refresh_trigger_type"]
          user_id: string
        }
        Update: {
          action_required?: string | null
          content_url?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          metric_after?: string | null
          metric_before?: string | null
          metric_label?: string | null
          product_id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["refresh_severity"]
          status?: string
          title?: string
          trigger_type?: Database["public"]["Enums"]["refresh_trigger_type"]
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          max_api_calls_monthly: number | null
          max_content_gens_monthly: number | null
          max_feeds: number | null
          max_products: number | null
          name: string
          price_monthly: number
          product_key: string
          sort_order: number | null
          stripe_price_id: string | null
          tier: string
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_api_calls_monthly?: number | null
          max_content_gens_monthly?: number | null
          max_feeds?: number | null
          max_products?: number | null
          name: string
          price_monthly: number
          product_key: string
          sort_order?: number | null
          stripe_price_id?: string | null
          tier: string
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          max_api_calls_monthly?: number | null
          max_content_gens_monthly?: number | null
          max_feeds?: number | null
          max_products?: number | null
          name?: string
          price_monthly?: number
          product_key?: string
          sort_order?: number | null
          stripe_price_id?: string | null
          tier?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          api_key_claude: string | null
          api_key_neuronwriter: string | null
          api_key_perplexity: string | null
          api_key_producthunt: string | null
          author_bio: string | null
          author_job_title: string | null
          author_linkedin: string | null
          author_name: string | null
          author_twitter: string | null
          author_url: string | null
          auto_publish: boolean | null
          created_at: string | null
          default_post_status: string | null
          gsc_connected: boolean | null
          gsc_oauth_token: Json | null
          gsc_property_url: string | null
          id: string
          neuronwriter_min_score: number | null
          scoring_threshold: number | null
          updated_at: string | null
          user_id: string
          wp_app_password: string | null
          wp_connected: boolean | null
          wp_seo_plugin: string | null
          wp_site_url: string | null
          wp_username: string | null
        }
        Insert: {
          api_key_claude?: string | null
          api_key_neuronwriter?: string | null
          api_key_perplexity?: string | null
          api_key_producthunt?: string | null
          author_bio?: string | null
          author_job_title?: string | null
          author_linkedin?: string | null
          author_name?: string | null
          author_twitter?: string | null
          author_url?: string | null
          auto_publish?: boolean | null
          created_at?: string | null
          default_post_status?: string | null
          gsc_connected?: boolean | null
          gsc_oauth_token?: Json | null
          gsc_property_url?: string | null
          id?: string
          neuronwriter_min_score?: number | null
          scoring_threshold?: number | null
          updated_at?: string | null
          user_id: string
          wp_app_password?: string | null
          wp_connected?: boolean | null
          wp_seo_plugin?: string | null
          wp_site_url?: string | null
          wp_username?: string | null
        }
        Update: {
          api_key_claude?: string | null
          api_key_neuronwriter?: string | null
          api_key_perplexity?: string | null
          api_key_producthunt?: string | null
          author_bio?: string | null
          author_job_title?: string | null
          author_linkedin?: string | null
          author_name?: string | null
          author_twitter?: string | null
          author_url?: string | null
          auto_publish?: boolean | null
          created_at?: string | null
          default_post_status?: string | null
          gsc_connected?: boolean | null
          gsc_oauth_token?: Json | null
          gsc_property_url?: string | null
          id?: string
          neuronwriter_min_score?: number | null
          scoring_threshold?: number | null
          updated_at?: string | null
          user_id?: string
          wp_app_password?: string | null
          wp_connected?: boolean | null
          wp_seo_plugin?: string | null
          wp_site_url?: string | null
          wp_username?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          api_calls_this_month: number | null
          content_gens_this_month: number | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          products_tracked: number | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
          usage_reset_at: string | null
          user_id: string
        }
        Insert: {
          api_calls_this_month?: number | null
          content_gens_this_month?: number | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          products_tracked?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage_reset_at?: string | null
          user_id: string
        }
        Update: {
          api_calls_this_month?: number | null
          content_gens_this_month?: number | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          products_tracked?: number | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          usage_reset_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_format: "seo-article" | "youtube-script" | "pinterest-pin" | "social-post" | "reddit-draft" | "email"
      content_intent: "informational" | "comparison" | "review" | "how-to"
      feed_health: "healthy" | "warning" | "error"
      feed_type: "serp-gap" | "gsc-miner" | "kgr-weakspot" | "pseo-engine" | "ai-proxy" | "reddit-miner" | "youtube-comments" | "yt-blog-overlap"
      gap_status: "double-gap" | "google-only" | "llm-only" | "closing" | "saturated"
      gap_verdict: "auto-queue" | "human-review" | "discard"
      llm_engine: "chatgpt" | "perplexity" | "gemini" | "copilot"
      llm_response_type: "no-info" | "vague" | "generic" | "detailed" | "cites-sources"
      platform: "blog" | "youtube" | "pinterest" | "social" | "reddit" | "email"
      publish_status: "draft" | "scheduled" | "publishing" | "published" | "failed"
      refresh_severity: "high" | "medium" | "low"
      refresh_trigger_type: "serp-drop" | "product-update" | "content-stale" | "competitor-new" | "geo-citation-lost" | "conversion-drop"
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
