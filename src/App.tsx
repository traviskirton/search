import { memo, useEffect, useRef, useState } from 'react'
import { Box, Center, Text, Loader, useMantineTheme } from '@mantine/core'
import { SearchResult, DataLine, type Link } from './components/SearchResult'
import { SearchInterface } from './components/SearchInterface'
import { useSearch } from './hooks/useSearch'
import type { SearchResultData } from './types'

/** Cards rendered per batch; more load as the grid scrolls into view */
const PAGE_SIZE = 60

interface ResultCardProps {
  name: string
  description: string
  type: string
  tags?: string[]
  links?: Link[]
}

/** Skips re-rendering when a card's data hasn't changed between queries */
const ResultCard = memo(function ResultCard({ name, description, type, tags, links }: ResultCardProps) {
  return (
    <SearchResult
      title={name}
      description={description}
      type={type}
      dataLine={<DataLine tags={tags?.slice(0, 1)} links={links} />}
    />
  )
})

function App() {
  const theme = useMantineTheme()
  const {
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
  } = useSearch()

  // Render results in batches, starting over whenever they change
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [shownResults, setShownResults] = useState<SearchResultData[]>(results)
  if (shownResults !== results) {
    setShownResults(results)
    setVisibleCount(PAGE_SIZE)
  }

  // A fresh observer per batch reports once after layout, so each batch
  // loads only if the end of the grid is still near the viewport
  const sentinelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || visibleCount >= results.length) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisibleCount((count) => count + PAGE_SIZE)
      },
      { rootMargin: '600px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [visibleCount, results.length])

  return (
    <Box p={theme.spacing.xl} w="100%">
      {/* <Title mb="lg">{__APP_NAME__}</Title> */}
      <SearchInterface
        value={search}
        onChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortDirection={sortDirection}
        onSortDirectionChange={setSortDirection}
      />
      {loading ? (
        <Center py="xl">
          <Loader />
        </Center>
      ) : (
        <Box
          mt="md"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 375px))',
            gridAutoRows: 200,
            gap: 'var(--mantine-spacing-sm)',
          }}
        >
          {results.slice(0, visibleCount).map((result) => (
            <ResultCard
              key={result.id}
              name={result.name}
              description={result.description}
              type={result.type}
              tags={result.tags}
              links={result.links}
            />
          ))}
        </Box>
      )}
      <div ref={sentinelRef} />
      {!loading && (search || filters.length > 0) && results.length === 0 && (
        <Text fw={theme.fontWeights.medium} c="var(--sc-muted)" ta="center" py="md">
          No results found
        </Text>
      )}
    </Box>
  )
}

export default App
