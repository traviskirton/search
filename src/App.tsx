import { Box, Title, Text, Loader, useMantineTheme } from '@mantine/core'
import { SearchResult, DataLine } from './components/SearchResult'
import { SearchInterface } from './components/SearchInterface'
import { useSearch } from './hooks/useSearch'

function App() {
  const theme = useMantineTheme()
  const { search, setSearch, filters, setFilters, results, availableTags, loading } = useSearch()

  return (
    <Box p={theme.spacing.xxxl} w="100%">
      <Title mb="lg">{__APP_NAME__}</Title>
      <SearchInterface
        value={search}
        onChange={setSearch}
        filters={filters}
        onFiltersChange={setFilters}
        availableTags={availableTags}
      />
      {loading ? (
        <Loader size="sm" />
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
          {results.map((result) => (
            <SearchResult
              key={result.id}
              title={result.name}
              description={result.description}
              type={result.type}
              dataLine={<DataLine tags={result.tags?.slice(0, 1)} links={result.links} />}
            />
          ))}
        </Box>
      )}
      {!loading && (search || filters.length > 0) && results.length === 0 && (
        <Text c="dimmed" ta="center" py="md">
          No results found
        </Text>
      )}
    </Box>
  )
}

export default App
