import { getSupabase } from '../admin-ui/utils/supabaseClient'
import { getFallbackKnowledgeHubItems } from '../utils/fallbackData'

export type GridCursor = {
  p: string // published_at ISO
  id: string | number
}

export function encodeCursor(cur: GridCursor | null): string | null {
  if (!cur) return null
  try {
    // Use browser-safe base64
    return btoa(unescape(encodeURIComponent(JSON.stringify(cur))))
  } catch {
    return null
  }
}

export function decodeCursor(s: string | null | undefined): GridCursor | null {
  if (!s) return null
  try {
    const json = decodeURIComponent(escape(atob(String(s))))
    const obj = JSON.parse(json)
    if (obj && obj.p && obj.id !== undefined) return obj as GridCursor
  } catch {}
  return null
}

export interface ListPublicMediaParams {
  limit?: number
  after?: string | null // base64 cursor from encodeCursor
  tag?: string | null
  q?: string | null
  subMarketplace?: 'written' | 'multimedia' | null
}

export interface PublicMediaItem {
  id: string
  title: string
  summary: string | null
  thumbnail_url: string | null
  type: string | null
  tags: string[] | null
  published_at: string | null
}

export interface ListPublicMediaResult {
  items: PublicMediaItem[]
  nextCursor: string | null
}

// Fetch lean grid items using keyset pagination against v_media_public_grid
export async function listPublicMedia({ limit = 12, after, tag, q }: ListPublicMediaParams = {}): Promise<ListPublicMediaResult> {
  try {
    const supabase = getSupabase()
    let query = supabase
      .from('v_media_public_grid')
      .select('id,title,summary,thumbnail_url,type,tags,published_at')
      .order('published_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit)

    // Keyset cursor
    const cur = decodeCursor(after)
    if (cur && cur.p && cur.id !== undefined && cur.id !== null) {
      // (published_at, id) < (cur.p, cur.id) using OR grouping
      // Do not URL-encode values; Supabase/PostgREST handles encoding
      const p = String(cur.p)
      const id = String(cur.id)
      query = query.or(`published_at.lt.${p},and(published_at.eq.${p},id.lt.${id})`)
    }

    // Tag filter against tags JSON/array
    if (tag) {
      try {
        query = query.contains('tags', [tag])
      } catch {
        // Ignore if data type is not jsonb/array
      }
    }

    // Basic title search (trigram/ilike accelerated by index when available)
    if (q && q.trim()) {
      const safe = q.replace(/%/g, '')
      query = query.ilike('title', `%${safe}%`)
    }

    const { data, error } = await query
    if (error) throw error
    let items = (data || []) as PublicMediaItem[]
    
    // Always include prediction analysis from mock data if not already present
    const hasPredictionAnalysis = items.some(item => item.id === 'prediction-analysis-dco')
    if (!hasPredictionAnalysis) {
      const mockItems = getFallbackKnowledgeHubItems()
      const predictionItem = mockItems.find(item => item.id === 'prediction-analysis-dco')
      if (predictionItem) {
        const predictionPublicItem: PublicMediaItem = {
          id: String(predictionItem.id),
          title: predictionItem.title,
          summary: predictionItem.description || null,
          thumbnail_url: predictionItem.imageUrl || null,
          type: predictionItem.mediaType || null,
          tags: Array.isArray(predictionItem.tags) ? predictionItem.tags.map(String) : null,
          published_at: predictionItem.date || new Date().toISOString()
        }
        // Add at the beginning to make it prominent
        items = [predictionPublicItem, ...items]
      }
    }
    
    const last = items[items.length - 1]
    const nextCursor = last && last.published_at
      ? encodeCursor({ p: last.published_at, id: last.id })
      : null
    return { items, nextCursor }
  } catch (error) {
    // Fallback to mock data when Supabase is not available or fails
    console.warn('Supabase query failed, falling back to mock data:', error)
    return getFallbackKnowledgeHubData({ limit, after, tag, q })
  }
}

// Fallback function to use mock data with similar pagination behavior
function getFallbackKnowledgeHubData({ limit = 12, after, tag, q }: ListPublicMediaParams): ListPublicMediaResult {
  let items = getFallbackKnowledgeHubItems()
  
  // Apply search filter
  if (q && q.trim()) {
    const searchQuery = q.toLowerCase()
    items = items.filter(item => 
      item.title.toLowerCase().includes(searchQuery) ||
      (item.description && item.description.toLowerCase().includes(searchQuery)) ||
      (Array.isArray(item.tags) && item.tags.some(tag => 
        String(tag).toLowerCase().includes(searchQuery)
      ))
    )
  }
  
  // Apply tag filter
  if (tag) {
    items = items.filter(item => 
      Array.isArray(item.tags) && item.tags.some(t => 
        String(t).toLowerCase() === tag.toLowerCase()
      )
    )
  }
  
  // Convert to PublicMediaItem format
  const publicItems: PublicMediaItem[] = items.map(item => ({
    id: String(item.id),
    title: item.title,
    summary: item.description || null,
    thumbnail_url: item.imageUrl || null,
    type: item.mediaType || null,
    tags: Array.isArray(item.tags) ? item.tags.map(String) : null,
    published_at: item.date || new Date().toISOString()
  }))
  
  // Simple pagination - just slice the array
  const startIndex = after ? 0 : 0 // For simplicity, ignore cursor in fallback
  const endIndex = startIndex + limit
  const paginatedItems = publicItems.slice(startIndex, endIndex)
  
  // Simple next cursor - just return null for now since it's fallback data
  const nextCursor = paginatedItems.length === limit && endIndex < publicItems.length 
    ? encodeCursor({ p: new Date().toISOString(), id: String(endIndex) })
    : null
    
  return { items: paginatedItems, nextCursor }
}

// Map grid item to KnowledgeHubCard shape (preserving all necessary fields)
export function mapGridToCard(item: PublicMediaItem) {
  const baseCard = {
    id: String(item.id),
    title: item.title,
    description: item.summary || '',
    mediaType: item.type || undefined,
    provider: originalItem?.provider || { name: 'Knowledge Hub', logoUrl: '/mzn_logo.png' },
    imageUrl: item.thumbnail_url || undefined,
    tags: Array.isArray(item.tags) ? item.tags : [],
    date: item.published_at || undefined,
    // Preserve important navigation fields
    blogUrl: originalItem?.blogUrl,
    articleUrl: originalItem?.articleUrl,
    // Preserve other fields that might be needed
    businessStage: originalItem?.businessStage,
    domain: originalItem?.domain,
    format: originalItem?.format,
    popularity: originalItem?.popularity,
    filterType: originalItem?.filterType,
    readTime: originalItem?.readTime,
    author: originalItem?.author,
  }
  
  // Special handling for prediction analysis - add the custom detailsUrl
  if (item.id === 'prediction-analysis-dco') {
    return {
      ...baseCard,
      detailsUrl: '/marketplace/knowledge-hub/prediction-analysis'
    }
  }
  
  return baseCard
}
