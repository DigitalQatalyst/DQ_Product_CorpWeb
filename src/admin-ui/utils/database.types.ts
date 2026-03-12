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
      media_items: {
        Row: {
          id: string
          slug: string | null
          title: string | null
          summary: string | null
          status: 'Draft' | 'InReview' | 'Scheduled' | 'Published' | 'Archived' | string
          visibility: 'Public' | 'Private' | 'Unlisted' | string
          language: string | null
          seo_title: string | null
          seo_description: string | null
          canonical_url: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          thumbnail_url: string | null
          tags: Json | null
          category: string | null
          featured: boolean | null
          hero_image: string | null
          read_time: number | null
          highlights: string | null
        }
        Insert: {
          id?: string
          slug?: string | null
          title?: string | null
          summary?: string | null
          status?: 'Draft' | 'InReview' | 'Scheduled' | 'Published' | 'Archived' | string
          visibility?: 'Public' | 'Private' | 'Unlisted' | string
          language?: string | null
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          thumbnail_url?: string | null
          tags?: Json | null
          category?: string | null
          featured?: boolean | null
          hero_image?: string | null
          read_time?: number | null
          highlights?: string | null
        }
        Update: {
          id?: string
          slug?: string | null
          title?: string | null
          summary?: string | null
          status?: 'Draft' | 'InReview' | 'Scheduled' | 'Published' | 'Archived' | string
          visibility?: 'Public' | 'Private' | 'Unlisted' | string
          language?: string | null
          seo_title?: string | null
          seo_description?: string | null
          canonical_url?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          thumbnail_url?: string | null
          tags?: Json | null
          category?: string | null
          featured?: boolean | null
          hero_image?: string | null
          read_time?: number | null
          highlights?: string | null
        }
        Relationships: []
      }
      ,
      articles: {
        Row: { id: string; body_html: string | null; body_json: Json | null; byline: string | null; source: string | null }
        Insert: { id: string; body_html?: string | null; body_json?: Json | null; byline?: string | null; source?: string | null }
        Update: { id?: string; body_html?: string | null; body_json?: Json | null; byline?: string | null; source?: string | null }
        Relationships: [{ foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] }]
      }
      ,
      videos: {
        Row: { id: string; video_url: string | null; platform: string | null; duration_sec: number | null; transcript_url: string | null }
        Insert: { id: string; video_url?: string | null; platform?: string | null; duration_sec?: number | null; transcript_url?: string | null }
        Update: { id?: string; video_url?: string | null; platform?: string | null; duration_sec?: number | null; transcript_url?: string | null }
        Relationships: [{ foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] }]
      }
      ,
      podcasts: {
        Row: { id: string; audio_url: string | null; is_video_episode: boolean | null; episode_no: number | null; duration_sec: number | null; transcript_url: string | null }
        Insert: { id: string; audio_url?: string | null; is_video_episode?: boolean | null; episode_no?: number | null; duration_sec?: number | null; transcript_url?: string | null }
        Update: { id?: string; audio_url?: string | null; is_video_episode?: boolean | null; episode_no?: number | null; duration_sec?: number | null; transcript_url?: string | null }
        Relationships: [{ foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] }]
      }
      ,
      reports: {
        Row: { id: string; document_url: string | null; pages: number | null; file_size_mb: number | null }
        Insert: { id: string; document_url?: string | null; pages?: number | null; file_size_mb?: number | null }
        Update: { id?: string; document_url?: string | null; pages?: number | null; file_size_mb?: number | null }
        Relationships: [{ foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] }]
      }
      ,
      tools: {
        Row: { id: string; document_url: string | null; requirements: string | null; file_size_mb: number | null }
        Insert: { id: string; document_url?: string | null; requirements?: string | null; file_size_mb?: number | null }
        Update: { id?: string; document_url?: string | null; requirements?: string | null; file_size_mb?: number | null }
        Relationships: [{ foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] }]
      }
      ,
      events: {
        Row: { id: string; start_at: string | null; end_at: string | null; venue: string | null; registration_url: string | null; timezone: string | null }
        Insert: { id: string; start_at?: string | null; end_at?: string | null; venue?: string | null; registration_url?: string | null; timezone?: string | null }
        Update: { id?: string; start_at?: string | null; end_at?: string | null; venue?: string | null; registration_url?: string | null; timezone?: string | null }
        Relationships: [{ foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] }]
      }
      ,
      media_assets: {
        Row: {
          id: string
          media_id: string
          kind: 'Image' | 'Video' | 'Audio' | 'Doc' | string
          storage_path: string
          public_url: string | null
          mime: string | null
          size_bytes: number | null
          width: number | null
          height: number | null
          duration_sec: number | null
          checksum: string | null
          created_at: string
        }
        Insert: {
          id?: string
          media_id: string
          kind: 'Image' | 'Video' | 'Audio' | 'Doc' | string
          storage_path: string
          public_url?: string | null
          mime?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          duration_sec?: number | null
          checksum?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          media_id?: string
          kind?: 'Image' | 'Video' | 'Audio' | 'Doc' | string
          storage_path?: string
          public_url?: string | null
          mime?: string | null
          size_bytes?: number | null
          width?: number | null
          height?: number | null
          duration_sec?: number | null
          checksum?: string | null
          created_at?: string
        }
        Relationships: []
      }
      ,
      taxonomies: {
        Row: { id: string; kind: 'Domain' | 'Stage' | 'Format' | 'Tag' | string; label: string; key: string }
        Insert: { id?: string; kind: 'Domain' | 'Stage' | 'Format' | 'Tag' | string; label: string; key: string }
        Update: { id?: string; kind?: 'Domain' | 'Stage' | 'Format' | 'Tag' | string; label?: string; key?: string }
        Relationships: []
      }
      ,
      media_taxonomies: {
        Row: { media_id: string; taxonomy_id: string }
        Insert: { media_id: string; taxonomy_id: string }
        Update: { media_id?: string; taxonomy_id?: string }
        Relationships: [
          { foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] },
          { foreignKeyName: string; columns: string[]; referencedRelation: 'taxonomies'; referencedColumns: string[] }
        ]
      }
      ,
      authors: {
        Row: {
          id: string
          name: string
          title: string | null
          bio: string | null
          avatar_url: string | null
          linkedin_url: string | null
          twitter_url: string | null
          website_url: string | null
          email: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string | null
          bio?: string | null
          avatar_url?: string | null
          linkedin_url?: string | null
          twitter_url?: string | null
          website_url?: string | null
          email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ,
      blogs: {
        Row: {
          id: string
          author_id: string | null
          excerpt: string | null
          body_html: string | null
          body_json: Json | null
          focus_keyword: string | null
          related_keywords: Json | null
          byline: string | null
        }
        Insert: {
          id: string
          author_id?: string | null
          excerpt?: string | null
          body_html?: string | null
          body_json?: Json | null
          focus_keyword?: string | null
          related_keywords?: Json | null
          byline?: string | null
        }
        Update: {
          id?: string
          author_id?: string | null
          excerpt?: string | null
          body_html?: string | null
          body_json?: Json | null
          focus_keyword?: string | null
          related_keywords?: Json | null
          byline?: string | null
        }
        Relationships: [
          { foreignKeyName: 'blogs_author_id_fkey'; columns: ['author_id']; referencedRelation: 'authors'; referencedColumns: ['id'] },
        ]
      }
      ,
      content_submissions: {
        Row: {
          id: string
          media_id: string
          author_id: string
          status: 'Submitted' | 'InReview' | 'Approved' | 'Rejected' | 'Published'
          reviewer_id: string | null
          review_notes: string | null
          submitted_at: string
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          media_id: string
          author_id: string
          status?: 'Submitted' | 'InReview' | 'Approved' | 'Rejected' | 'Published'
          reviewer_id?: string | null
          review_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          media_id?: string
          author_id?: string
          status?: 'Submitted' | 'InReview' | 'Approved' | 'Rejected' | 'Published'
          reviewer_id?: string | null
          review_notes?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          { foreignKeyName: string; columns: string[]; referencedRelation: 'media_items'; referencedColumns: string[] },
          { foreignKeyName: string; columns: string[]; referencedRelation: 'authors'; referencedColumns: string[] }
        ]
      }
      ,
      audit_logs: {
        Row: { id: number; action: string; actor_id: string | null; at: string; entity: string; entity_id: string | null; diff: Json | null }
        Insert: { id?: number; action: string; actor_id?: string | null; at?: string; entity: string; entity_id?: string | null; diff?: Json | null }
        Update: { id?: number; action?: string; actor_id?: string | null; at?: string; entity?: string; entity_id?: string | null; diff?: Json | null }
        Relationships: []
      }
    }
    Views: {
      v_media_all: {
        Row: {
          id: string
          slug: string | null
          title: string | null
          summary: string | null
          body: string | null
          body_html: string | null
          body_json: Json | null
          type: string | null
          status: string | null
          visibility: string | null
          language: string | null
          seo_title: string | null
          seo_description: string | null
          canonical_url: string | null
          published_at: string | null
          created_at: string | null
          updated_at: string | null
          thumbnail_url: string | null
          hero_image: string | null
          category: string | null
          featured: boolean | null
          read_time: number | null
          highlights: string | null
          tags: Json | null
          // Blog-specific fields
          blog_excerpt: string | null
          blog_focus_keyword: string | null
          blog_related_keywords: Json | null
          blog_byline: string | null
          // Author information
          author_name: string | null
          author_title: string | null
          author_bio: string | null
          author_avatar: string | null
          author_linkedin: string | null
          author_twitter: string | null
          author_website: string | null
          // Article fields
          article_byline: string | null
          article_source: string | null
          // Video fields
          video_url: string | null
          platform: string | null
          video_duration_sec: number | null
          video_transcript_url: string | null
          // Podcast fields
          audio_url: string | null
          is_video_episode: boolean | null
          episode_no: number | null
          audio_duration_sec: number | null
          audio_transcript_url: string | null
          // Report fields
          report_document_url: string | null
          report_pages: number | null
          report_file_size_mb: number | null
          // Tool fields
          tool_document_url: string | null
          tool_requirements: string | null
          tool_file_size_mb: number | null
          // Event fields
          start_at: string | null
          end_at: string | null
          venue: string | null
          registration_url: string | null
          timezone: string | null
          // Legacy fields
          business_stage: string | null
          domain: string | null
          format: string | null
          popularity: string | null
          provider_name: string | null
          provider_logo_url: string | null
          image_url: string | null
          podcast_url: string | null
          file_size_bytes: number | null
          download_count: number | null
          event_date: string | null
          event_time: string | null
          event_location: string | null
          event_location_details: string | null
          event_registration_info: string | null
          event_agenda: Json | null
        }
      }
      ,
      v_media_public: { Row: Database['public']['Views']['v_media_all']['Row'] }
      ,
      v_media_with_authors: { Row: Database['public']['Views']['v_media_all']['Row'] }
    }
    Functions: {
      publish_media: { Args: { _id: string }; Returns: void }
      unpublish_media: { Args: { _id: string }; Returns: void }
      create_media_item: { Args: { _base: Json; _type: string; _child: Json }; Returns: string }
      update_media_item: { Args: { _id: string; _base: Json; _type: string; _child: Json }; Returns: string }
      get_media_item_full: { Args: { _id: string }; Returns: Database['public']['Views']['v_media_all']['Row'][] }
    }
    Enums: {}
    CompositeTypes: {}
  }
}
