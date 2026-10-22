import { useState, useRef, useEffect } from 'react'
import { TextInput, ActionIcon, ScrollArea, Loader, useMantineTheme } from '@mantine/core'
import { PaperPlaneRightIcon } from '@phosphor-icons/react'
import { useChat } from '../../hooks/useChat'
import classes from './ChatPanel.module.css'
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
    <div
      className={classes.panel}
      style={{ height: `calc(100vh - ${theme.spacing.xl} * 2)`, top: theme.spacing.xl }}
    >
      <div className={classes.header}>
        <span className={classes.title}>Chat</span>
        <span className={classes.status}>{isLoading ? 'Working' : 'Ready'}</span>
      </div>

      <ScrollArea flex={1} viewportRef={viewport}>
        <div className={classes.messages}>
          {messages.length === 0 && (
            <div className={classes.empty}>Ask questions or search with natural language</div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={classes.message} data-role={message.role}>
              {message.content}
            </div>
          ))}
          {isLoading && <Loader size="sm" className={classes.loader} />}
          {error && <div className={classes.error}>{error}</div>}
        </div>
      </ScrollArea>

      <div className={classes.composer}>
        <TextInput
          flex={1}
          placeholder="Ask or search in plain language…"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          classNames={{ input: classes.input }}
        />
        <ActionIcon
          variant="accent"
          size={40}
          radius={9}
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          aria-label="Send"
        >
          <PaperPlaneRightIcon size={16} />
        </ActionIcon>
      </div>
    </div>
  )
}
