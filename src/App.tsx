import { Box, Title, TextInput, Text, Loader } from '@mantine/core'
import { useState, useEffect } from 'react'
import MiniSearch from 'minisearch'
import { SearchResult, DataLine, Link } from './components/SearchResult'

interface SearchResultData {
  id: string
  type: string
  name: string
  description: string
  tags?: string[]
  links?: Link[]
  score: number
}

function App() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResultData[]>([])
  const [index, setIndex] = useState<MiniSearch | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/search-index.json')
      .then((res) => res.text())
      .then((data) => {
        const loadedIndex = MiniSearch.loadJSON(data, {
          fields: ['name', 'description', 'body', 'aliases', 'tags', 'facetText', 'related'],
        })
        setIndex(loadedIndex)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!index || !search.trim()) {
      setResults([])
      return
    }

    const searchResults = index.search(search, {
      prefix: true,
      fuzzy: search.length > 3 ? 0.2 : false,
      boost: { name: 10, aliases: 5, related: 3, tags: 2, description: 1 },
    })

    setResults(
      searchResults.slice(0, 40).map((r) => {
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
    )
  }, [search, index])

  return (
    <Box p="xl" w="100%">
      <Title mb="lg">{__APP_NAME__}</Title>
      <TextInput
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        size="md"
        mb="md"
        w="100%"
      />
      {loading ? (
        <Loader size="sm" />
      ) : (
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 360px))',
            gridAutoRows: 180,
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
      {!loading && search && results.length === 0 && (
        <Text c="dimmed" ta="center" py="md">
          No results found
        </Text>
      )}
    </Box>
  )
}

export default App
