import { useState, useRef, useEffect } from 'react'
import {
  Paper,
  Stack,
  Text,
  TextInput,
  ActionIcon,
  ScrollArea,
  Group,
  Box,
  Loader,
  useMantineTheme,
} from '@mantine/core'
import { PaperPlaneRightIcon } from '@phosphor-icons/react'
import { useChat } from '../../hooks/useChat'
import type { SearchResultData, SelectedFilter } from '../../types'

export interface ChatPanelProps {
  searchResults: SearchResultData[]
  onSearchChange: (search: string) => void
  onFiltersChange: (filters: SelectedFilter[]) => void
}

export function ChatPanel({ searchResults, onSearchChange, onFiltersChange }: ChatPanelProps) {
  const theme = useMantineTheme()
  const [input, setInput] = useState('')
  const { messages, sendMessage, isLoading, error } = useChat({
    searchResults,
    onSearchChange,
    onFiltersChange,
  })
  const viewport = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      sendMessage(input)
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  return (
    <Paper
      w={380}
      h="calc(100vh - var(--mantine-spacing-xxxl) * 2)"
      bd="1px solid gray.3"
      radius="md"
      style={{ position: 'sticky', top: theme.spacing.xxxl, flexShrink: 0 }}
    >
      <Stack h="100%" gap={0}>
        <Box p="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <Text fw={theme.fontWeights.semibold} fz="lg">
            Chat
          </Text>
        </Box>

        <ScrollArea flex={1} p="sm" viewportRef={viewport}>
          <Stack gap="sm">
            {messages.length === 0 && (
              <Text c="dimmed" fz="sm" ta="center" py="xl">
                Ask questions or search with natural language
              </Text>
            )}
            {messages.map((message, index) => (
              <Box
                key={index}
                p="xs"
                bg={message.role === 'user' ? 'blue.0' : 'gray.0'}
                style={{ borderRadius: theme.radius.sm }}
              >
                <Text fz="xs" fw={theme.fontWeights.medium} c="gray.6" mb={4}>
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </Text>
                <Text fz="sm" style={{ whiteSpace: 'pre-wrap' }}>
                  {message.content}
                </Text>
              </Box>
            ))}
            {isLoading && (
              <Group justify="center" py="xs">
                <Loader size="sm" />
              </Group>
            )}
            {error && (
              <Text c="red" fz="sm" ta="center">
                {error}
              </Text>
            )}
          </Stack>
        </ScrollArea>

        <Box p="sm" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Group gap="xs">
            <TextInput
              flex={1}
              placeholder="Search or ask..."
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <ActionIcon
              variant="filled"
              color="blue"
              size="lg"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <PaperPlaneRightIcon size={18} />
            </ActionIcon>
          </Group>
        </Box>
      </Stack>
    </Paper>
  )
}
