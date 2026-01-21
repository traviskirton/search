import type { Link } from './components/SearchResult'

// Filter modifier types: none (OR), include (MUST +), exclude (NOT !)
export type FilterModifier = 'none' | 'include' | 'exclude'

// Sort options
export type SortOption = 'relevance' | 'alphabetical' | 'type'
export type SortDirection = 'asc' | 'desc'

// A selected filter with its modifier
export interface SelectedFilter {
  category: string
  tag: string
  modifier: FilterModifier
}

// Entity from the search index
export interface Entity {
  id: string
  type: string
  name: string
  description: string
  tagsArray?: string[]
  facets?: Record<string, string | string[]>
  links?: Link[]
}

// Search result for display
export interface SearchResultData {
  id: string
  type: string
  name: string
  description: string
  tags?: string[]
  links?: Link[]
  score: number
}
