import { Container, Title, TextInput, Stack, Card, Text, Badge, Group, Loader } from '@mantine/core'
import { useState, useEffect } from 'react'
import MiniSearch from 'minisearch'

interface SearchResult {
  id: string
  type: string
  name: string
  description: string
  score: number
}

function App() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
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
      searchResults.slice(0, 20).map((r) => ({
        id: r.id,
        type: (r as unknown as { type: string }).type,
        name: (r as unknown as { name: string }).name,
        description: (r as unknown as { description: string }).description,
        score: r.score,
      }))
    )
  }, [search, index])

  return (
    <Container size="sm" py="xl">
      <Title mb="lg">{__APP_NAME__}</Title>
      <TextInput
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        size="md"
        mb="md"
      />
      {loading ? (
        <Loader size="sm" />
      ) : (
        <Stack gap="xs">
          {results.map((result) => (
            <Card key={result.id} padding="sm" withBorder>
              <Group justify="space-between" mb={4}>
                <Text fw={600}>{result.name}</Text>
                <Badge size="sm" variant="light">
                  {result.type}
                </Badge>
              </Group>
              {result.description && (
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {result.description}
                </Text>
              )}
            </Card>
          ))}
          {search && results.length === 0 && (
            <Text c="dimmed" ta="center" py="md">
              No results found
            </Text>
          )}
        </Stack>
      )}
    </Container>
  )
}

export default App
