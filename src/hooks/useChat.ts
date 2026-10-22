import { useState, useCallback } from 'react'
import type { SearchResultData, SelectedFilter } from '../types'
import { TAG_TAXONOMY } from '../tag-taxonomy'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface SearchParams {
  search: string
  filters: SelectedFilter[]
}

export interface UseChatOptions {
  searchResults: SearchResultData[]
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: SelectedFilter[]) => void
}

export interface UseChatResult {
  messages: ChatMessage[]
  sendMessage: (text: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

function buildSearchParamsPrompt(): string {
  const categories = TAG_TAXONOMY.map((cat) => `- ${cat.id}: ${cat.children.join(', ')}`).join('\n')

  return `You convert natural language into search parameters. Return JSON only, no markdown.

Categories and valid tags (ONLY use these exact values):
${categories}

Filter modifiers:
- "none": default OR within category
- "include": MUST have
- "exclude": must NOT have

Output format:
{"search": "query or empty string", "filters": [{"category": "...", "tag": "...", "modifier": "none|include|exclude"}]}

Return null if the message is not a search request (general questions, chitchat, asking about results).`
}

export function useChat({ searchResults, onSearchChange, onFiltersChange }: UseChatOptions): UseChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callOpenAI = useCallback(
    async (systemPrompt: string, userText: string, history: ChatMessage[] = []) => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OpenAI API key not configured')
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4.1-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: userText },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `API error: ${response.status}`)
      }

      const data = await response.json()
      return data.choices?.[0]?.message?.content || ''
    },
    []
  )

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      const userMessage: ChatMessage = { role: 'user', content: text }
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        // First, try to extract search params
        const paramsResponse = await callOpenAI(buildSearchParamsPrompt(), text)
        const searchParams = parseSearchParams(paramsResponse)

        if (searchParams) {
          // Apply search params
          onSearchChange(searchParams.search)
          onFiltersChange(searchParams.filters)

          // Generate confirmation message
          const confirmation = buildConfirmation(searchParams)
          const assistantMessage: ChatMessage = { role: 'assistant', content: confirmation }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          // Not a search request - answer the question about results
          const chatPrompt = buildChatPrompt(searchResults)
          const response = await callOpenAI(chatPrompt, text, messages)
          const assistantMessage: ChatMessage = { role: 'assistant', content: response }
          setMessages((prev) => [...prev, assistantMessage])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to send message'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [messages, searchResults, callOpenAI, onSearchChange, onFiltersChange]
  )

  return {
    messages,
    sendMessage,
    isLoading,
    error,
  }
}

function parseSearchParams(response: string): SearchParams | null {
  try {
    const trimmed = response.trim()
    if (trimmed === 'null' || trimmed === '') return null

    const parsed = JSON.parse(trimmed)
    if (!parsed || typeof parsed !== 'object') return null

    // Build a set of valid tags for validation
    const validTags = new Set<string>()
    const categoryIds = new Set<string>()
    for (const cat of TAG_TAXONOMY) {
      categoryIds.add(cat.id)
      for (const tag of cat.children) {
        validTags.add(tag.toLowerCase())
      }
    }

    // Normalize tag: "Christopher Nolan" -> "christopher-nolan"
    const normalizeTag = (tag: string): string => {
      return tag.toLowerCase().replace(/\s+/g, '-')
    }

    const filters = (parsed.filters || [])
      .map((f: { category: string; tag: string; modifier?: string }) => ({
        category: f.category,
        tag: normalizeTag(f.tag),
        modifier: f.modifier || 'none',
      }))
      .filter((f: { category: string; tag: string }) =>
        categoryIds.has(f.category) && validTags.has(f.tag)
      )

    return {
      search: parsed.search || '',
      filters,
    }
  } catch {
    return null
  }
}

function buildConfirmation(params: SearchParams): string {
  const parts: string[] = []

  if (params.search) {
    parts.push(`Searching for "${params.search}"`)
  }

  if (params.filters.length > 0) {
    const filterDescs = params.filters.map((f) => {
      const prefix = f.modifier === 'exclude' ? 'excluding ' : f.modifier === 'include' ? 'must be ' : ''
      return `${prefix}${f.tag}`
    })
    parts.push(`Filtering by: ${filterDescs.join(', ')}`)
  }

  return parts.length > 0 ? parts.join('. ') + '.' : 'Search updated.'
}

function buildChatPrompt(searchResults: SearchResultData[]): string {
  const resultsContext =
    searchResults.length > 0
      ? searchResults
          .slice(0, 20)
          .map((r) => `- ${r.name} (${r.type}): ${r.description}`)
          .join('\n')
      : 'No search results currently displayed.'

  return `You are a helpful assistant that helps users understand and explore search results. Be concise.

Current search results being displayed:
${resultsContext}

Help the user understand these results, answer questions about them, or provide additional context.`
}
