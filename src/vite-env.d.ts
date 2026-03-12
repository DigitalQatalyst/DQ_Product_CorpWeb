/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_OPENAI_API_KEY: string
  readonly VITE_AZURE_OPENAI_ENDPOINT: string
  readonly VITE_AZURE_OPENAI_DEPLOYMENT_NAME: string
  readonly VITE_AZURE_OPENAI_API_VERSION: string
  readonly VITE_AIRTABLE_API_KEY: string
  readonly VITE_AIRTABLE_BASE_ID: string
  readonly VITE_AIRTABLE_TABLE_ID: string
  readonly VITE_AIRTABLE_CONSULTATION_TABLE_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}