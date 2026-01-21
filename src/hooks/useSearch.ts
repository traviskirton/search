import { useState, useEffect, useMemo, useCallback } from 'react'
import MiniSearch from 'minisearch'
import { TAG_TAXONOMY } from '../tag-taxonomy'
import type { Entity, SelectedFilter, SearchResultData, SortOption, SortDirection } from '../types'
import type { Link } from '../components/SearchResult'

export interface UseSearchResult {
  search: string
  setSearch: (value: string) => void
  filters: SelectedFilter[]
  setFilters: (filters: SelectedFilter[]) => void
  results: SearchResultData[]
  availableTags: Record<string, Set<string>>
  loading: boolean
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  sortDirection: SortDirection
  setSortDirection: (dir: SortDirection) => void
}

export function useSearch(): UseSearchResult {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<SelectedFilter[]>([])
  const [results, setResults] = useState<SearchResultData[]>([])
  const [allEntities, setAllEntities] = useState<Entity[]>([])
  const [index, setIndex] = useState<MiniSearch | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Load the search index
  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.text())
      .then((data) => {
        const loadedIndex = MiniSearch.loadJSON(data, {
          fields: ['name', 'description', 'body', 'aliases', 'tags', 'facetText', 'related'],
        })
        setIndex(loadedIndex)

        // Extract all entities from the index for filtering
        const entities: Entity[] = []
        // @ts-expect-error - accessing internal MiniSearch properties
        loadedIndex._documentIds.forEach((_: unknown, docId: number) => {
          // @ts-expect-error - accessing internal MiniSearch properties
          const stored = loadedIndex._storedFields.get(docId) as Record<string, unknown> | undefined
          if (stored) {
            entities.push({
              id: stored.id as string,
              type: stored.type as string,
              name: stored.name as string,
              description: stored.description as string,
              tagsArray: stored.tagsArray as string[] | undefined,
              facets: stored.facets as Record<string, string | string[]> | undefined,
              links: stored.links as Link[] | undefined,
            })
          }
        })
        setAllEntities(entities)
        setLoading(false)
      })
  }, [])

  // Get all searchable values for an entity
  const getEntityValues = useCallback((entity: Entity): Set<string> => {
    const values = new Set<string>()

    if (entity.type) values.add(entity.type.toLowerCase())

    if (entity.tagsArray) {
      entity.tagsArray.forEach((tag) => values.add(tag.toLowerCase()))
    }

    if (entity.facets) {
      Object.values(entity.facets).forEach((val) => {
        if (Array.isArray(val)) {
          val.forEach((v) => {
            if (typeof v === 'string') values.add(v.toLowerCase())
          })
        } else if (typeof val === 'string') {
          values.add(val.toLowerCase())
        }
      })
    }

    return values
  }, [])

  // Check if entity matches filters for a specific category
  const entityMatchesCategoryFilters = useCallback(
    (entity: Entity, categoryId: string, entityValues?: Set<string>): boolean => {
      const categoryFilters = filters.filter((f) => f.category === categoryId)
      if (categoryFilters.length === 0) return true

      const values = entityValues || getEntityValues(entity)

      const noneFilters = categoryFilters.filter((f) => f.modifier === 'none')
      const includeFilters = categoryFilters.filter((f) => f.modifier === 'include')
      const excludeFilters = categoryFilters.filter((f) => f.modifier === 'exclude')

      // Check exclude filters
      for (const filter of excludeFilters) {
        if (values.has(filter.tag.toLowerCase())) return false
      }

      // Check include (MUST) filters
      for (const filter of includeFilters) {
        if (!values.has(filter.tag.toLowerCase())) return false
      }

      // Check none (OR) filters - must match at least one
      if (noneFilters.length > 0) {
        const matchesAny = noneFilters.some((f) => values.has(f.tag.toLowerCase()))
        if (!matchesAny) return false
      }

      return true
    },
    [filters, getEntityValues]
  )

  // Check if an entity matches all filters
  const entityMatchesFilters = useCallback(
    (entity: Entity): boolean => {
      if (filters.length === 0) return true

      const entityValues = getEntityValues(entity)

      for (const category of TAG_TAXONOMY) {
        if (!entityMatchesCategoryFilters(entity, category.id, entityValues)) {
          return false
        }
      }

      return true
    },
    [filters, getEntityValues, entityMatchesCategoryFilters]
  )

  // Compute available tags for each category based on current filters
  const availableTags = useMemo(() => {
    const available: Record<string, Set<string>> = {}

    for (const category of TAG_TAXONOMY) {
      available[category.id] = new Set<string>()
    }

    // Get search match IDs if there's a query
    let searchMatchIds: Set<string> | null = null
    if (search.trim() && index) {
      const searchResults = index.search(search, {
        prefix: true,
        fuzzy: search.length > 3 ? 0.2 : false,
      })
      searchMatchIds = new Set(searchResults.map((r) => r.id))
    }

    const categoryHasMust = (categoryId: string) =>
      filters.some((f) => f.category === categoryId && f.modifier === 'include')

    for (const entity of allEntities) {
      if (searchMatchIds && !searchMatchIds.has(entity.id)) continue

      const entityValues = getEntityValues(entity)

      for (const category of TAG_TAXONOMY) {
        let matchesOtherCategories = true

        for (const otherCategory of TAG_TAXONOMY) {
          if (otherCategory.id === category.id) continue
          if (!entityMatchesCategoryFilters(entity, otherCategory.id, entityValues)) {
            matchesOtherCategories = false
            break
          }
        }

        if (!matchesOtherCategories) continue

        if (categoryHasMust(category.id)) {
          if (!entityMatchesCategoryFilters(entity, category.id, entityValues)) continue
        }

        for (const tag of category.children) {
          if (entityValues.has(tag.toLowerCase())) {
            available[category.id].add(tag)
          }
        }
      }
    }

    // Always include currently selected tags so user can deselect them
    for (const filter of filters) {
      available[filter.category]?.add(filter.tag)
    }

    return available
  }, [allEntities, filters, search, index, getEntityValues, entityMatchesCategoryFilters])

  // Update results when search or filters change
  useEffect(() => {
    if (!index) {
      setResults([])
      return
    }

    let searchResults: SearchResultData[]

    if (search.trim()) {
      const miniSearchResults = index.search(search, {
        prefix: true,
        fuzzy: search.length > 3 ? 0.2 : false,
        boost: { name: 10, aliases: 5, related: 3, tags: 2, description: 1 },
      })

      searchResults = miniSearchResults.slice(0, 100).map((r) => {
        const result = r as unknown as {
          type: string
          name: string
          description: string
          tagsArray?: string[]
          links?: Link[]
        }
        return {
          id: r.id,
          type: result.type,
          name: result.name,
          description: result.description,
          tags: result.tagsArray,
          links: result.links,
          score: r.score,
        }
      })
    } else if (filters.length > 0) {
      searchResults = allEntities.map((e) => ({
        id: e.id,
        type: e.type,
        name: e.name,
        description: e.description,
        tags: e.tagsArray,
        links: e.links,
        score: 0,
      }))
    } else {
      searchResults = []
    }

    if (filters.length > 0) {
      const entityMap = new Map(allEntities.map((e) => [e.id, e]))
      searchResults = searchResults.filter((r) => {
        const entity = entityMap.get(r.id)
        return entity ? entityMatchesFilters(entity) : false
      })
    }

    // Apply sorting
    const dir = sortDirection === 'asc' ? 1 : -1
    switch (sortBy) {
      case 'relevance':
        // For relevance, desc means highest score first
        searchResults.sort((a, b) => dir * (b.score - a.score))
        break
      case 'alphabetical':
        // For alphabetical, asc means A-Z
        searchResults.sort((a, b) => dir * a.name.localeCompare(b.name))
        break
      case 'type':
        // Sort by type, then by name
        searchResults.sort((a, b) => {
          const typeCompare = a.type.localeCompare(b.type)
          if (typeCompare !== 0) return dir * typeCompare
          return a.name.localeCompare(b.name)
        })
        break
    }

    setResults(searchResults.slice(0, 40))
  }, [search, filters, index, allEntities, entityMatchesFilters, sortBy, sortDirection])

  return {
    search,
    setSearch,
    filters,
    setFilters,
    results,
    availableTags,
    loading,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
  }
}
