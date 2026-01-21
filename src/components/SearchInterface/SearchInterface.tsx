import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core'
import {
  CaretDownIcon,
  CaretUpIcon,
  FunnelIcon,
  XIcon,
  PlusIcon,
  ExclamationMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@phosphor-icons/react'
import { useState, useCallback, useEffect } from 'react'
import { Menu } from '../Menu'
import { TAG_TAXONOMY, tagToLabel } from '../../tag-taxonomy'
import type { FilterModifier, SelectedFilter, SortOption, SortDirection } from '../../types'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'type', label: 'Type' },
]

export interface SearchInterfaceProps {
  value: string
  onChange: (value: string) => void
  filters?: SelectedFilter[]
  onFiltersChange?: (filters: SelectedFilter[]) => void
  availableTags?: Record<string, Set<string>>
  sortBy: SortOption
  onSortByChange: (sort: SortOption) => void
  sortDirection: SortDirection
  onSortDirectionChange: (dir: SortDirection) => void
}

export function SearchInterface({
  value,
  onChange,
  filters = [],
  onFiltersChange,
  availableTags,
  sortBy,
  onSortByChange,
  sortDirection,
  onSortDirectionChange,
}: SearchInterfaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('type')
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [optionHeld, setOptionHeld] = useState(false)
  const [filterButtonHovered, setFilterButtonHovered] = useState(false)
  const theme = useMantineTheme()

  // Track option/alt key state and keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) setOptionHeld(true)

      // Don't handle shortcuts when typing in an input
      const target = e.target as HTMLElement
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable

      if (e.key === 'Escape' && filtersVisible) {
        setFiltersVisible(false)
      } else if (e.key === 'f' && !isTyping) {
        e.preventDefault()
        setFiltersVisible((v) => !v)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey) setOptionHeld(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [filtersVisible])

  // Get tags for the currently selected category, filtered by availability
  const currentCategory = TAG_TAXONOMY.find((c) => c.id === selectedCategory)
  const allCategoryTags = currentCategory?.children ?? []
  const availableForCategory = availableTags?.[selectedCategory]
  const currentTags = availableForCategory
    ? allCategoryTags.filter((tag) => availableForCategory.has(tag))
    : allCategoryTags

  // Get the filter for a specific tag (if it exists)
  const getTagFilter = useCallback(
    (tag: string) => {
      return filters.find((f) => f.tag === tag)
    },
    [filters]
  )

  // Handle clicking a tag in the category section
  const handleTagClick = useCallback(
    (tag: string) => {
      if (!onFiltersChange) return

      const existingFilter = getTagFilter(tag)
      if (existingFilter) {
        // Remove it if already selected
        onFiltersChange(filters.filter((f) => f.tag !== tag))
      } else {
        // Add it with 'none' modifier (default)
        onFiltersChange([
          ...filters,
          { category: selectedCategory, tag, modifier: 'none' },
        ])
      }
    },
    [filters, onFiltersChange, selectedCategory, getTagFilter]
  )

  // Handle changing modifier on a ribbon tag
  const handleToggleModifier = useCallback(
    (tag: string) => {
      if (!onFiltersChange) return

      onFiltersChange(
        filters.map((f) => {
          if (f.tag === tag) {
            // Cycle: none -> include -> exclude -> none
            const nextModifier: FilterModifier =
              f.modifier === 'none' ? 'include' :
              f.modifier === 'include' ? 'exclude' : 'none'
            return {
              ...f,
              modifier: nextModifier,
            }
          }
          return f
        })
      )
    },
    [filters, onFiltersChange]
  )

  // Handle removing a filter from the ribbon
  const handleRemoveFilter = useCallback(
    (tag: string) => {
      if (!onFiltersChange) return
      onFiltersChange(filters.filter((f) => f.tag !== tag))
    },
    [filters, onFiltersChange]
  )

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    if (!onFiltersChange) return
    onFiltersChange([])
  }, [onFiltersChange])

  // Handle filter button click
  const handleFilterButtonClick = useCallback((e: React.MouseEvent) => {
    if (e.altKey && filters.length > 0) {
      // Option+click: clear all filters
      handleClearFilters()
    } else {
      // Normal click: toggle visibility
      setFiltersVisible((v) => !v)
    }
  }, [filters.length, handleClearFilters])

  // Toggle sort direction
  const handleToggleSortDirection = useCallback(() => {
    onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')
  }, [sortDirection, onSortDirectionChange])

  // Determine filter button color (red only when option held AND hovering AND has filters)
  const filterButtonColor = optionHeld && filterButtonHovered && filters.length > 0 ? 'red' : filters.length > 0 ? 'blue' : 'gray'

  // Get current sort label
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort'

  return (
    <Paper shadow={filtersVisible ? 'sm' : undefined} p="sm" radius="md" bd={filtersVisible ? '1px solid gray.4' : undefined}>
      <Stack gap="sm">
        {/* Search input */}
        <TextInput
          placeholder="Search..."
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          size="md"
          w="100%"
        />

        {/* Ribbon row: filter icon, selected tags, sort controls */}
        <Group gap="sm" justify="space-between" p="0" m="0">
          <ActionIcon
            variant="subtle"
            color={filterButtonColor}
            size="lg"
            onClick={handleFilterButtonClick}
            onMouseEnter={() => setFilterButtonHovered(true)}
            onMouseLeave={() => setFilterButtonHovered(false)}
            title={optionHeld && filterButtonHovered && filters.length > 0 ? 'Clear all filters (Option+Click)' : filtersVisible ? 'Hide filters' : 'Show filters'}
          >
            <FunnelIcon size={16} />
          </ActionIcon>

          {/* Selected tag ribbon */}
          <ScrollArea style={{ flex: 1 }} scrollbarSize={0} offsetScrollbars>
            <Group justify="start" gap="xs" wrap="nowrap">
              {filters.map((filter) => (
                <RibbonTag
                  key={filter.tag}
                  filter={filter}
                  onToggleModifier={() => handleToggleModifier(filter.tag)}
                  onRemove={() => handleRemoveFilter(filter.tag)}
                />
              ))}
            </Group>
          </ScrollArea>

          {/* Sort controls - Button Group */}
          <Button.Group>
            <Menu
              items={SORT_OPTIONS.map((option) => ({
                label: option.label,
                selected: option.value === sortBy,
                onClick: () => onSortByChange(option.value),
              }))}
              position="bottom-end"
            >
              <Button
                size="sm"
                variant="outline"
                color="dark"
              >
                {currentSortLabel}
              </Button>
            </Menu>
            <Button
              size="sm"
              variant="outline"
              color="dark"
              onClick={handleToggleSortDirection}
              px="xs"
            >
              {sortDirection === 'asc' ? <ArrowUpIcon size={14} /> : <ArrowDownIcon size={14} />}
            </Button>
          </Button.Group>
        </Group>
        {filtersVisible && (
          <Stack gap={theme.spacing.xxxs}>
            {/* Category buttons */}
            <ScrollArea scrollbarSize={4} offsetScrollbars>
              <Group gap="xs" wrap="nowrap">
                {TAG_TAXONOMY.map((category) => {
                  const isSelected = category.id === selectedCategory
                  const hasFiltersInCategory = filters.some(
                    (f) => f.category === category.id
                  )
                  return (
                    <Button
                      key={category.id}
                      variant={isSelected ? 'light' : 'subtle'}
                      color={hasFiltersInCategory ? 'blue' : 'dark'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.label}
                    </Button>
                  )
                })}
              </Group>
            </ScrollArea>
            <Divider />
            {/* Tags for selected category */}
            <Group gap="xs" wrap="wrap" pt={theme.spacing.xxs}>
              {currentTags.map((tag) => {
                const filter = getTagFilter(tag)
                const isSelected = !!filter

                return (
                  <Button
                    key={tag}
                    variant={isSelected ? 'light' : 'subtle'}
                    color={
                      isSelected
                        ? filter.modifier === 'exclude'
                          ? 'red'
                          : filter.modifier === 'include'
                            ? 'green'
                            : 'blue'
                        : 'dark'
                    }
                    size="xs"
                    onClick={() => handleTagClick(tag)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {tagToLabel(tag)}
                  </Button>
                )
              })}
            </Group>
          </Stack>
        )}
      </Stack>
    </Paper>
  )
}

// Ribbon tag component with modifier toggle
interface RibbonTagProps {
  filter: SelectedFilter
  onToggleModifier: () => void
  onRemove: () => void
}

function RibbonTag({ filter, onToggleModifier, onRemove }: RibbonTagProps) {
  const theme = useMantineTheme()

  const color =
    filter.modifier === 'exclude' ? 'red' :
    filter.modifier === 'include' ? 'green' : 'blue'

  const icon =
    filter.modifier === 'exclude' ? <ExclamationMarkIcon size={12} /> :
    filter.modifier === 'include' ? <PlusIcon size={12} /> : null

  return (
    <Button.Group>
      <Button
        size="sm"
        variant="light"
        color={color}
        onClick={onToggleModifier}
        leftSection={icon}
        styles={{
          root: {
            paddingRight: theme.spacing.xs,
          },
        }}
      >
        {tagToLabel(filter.tag)}
      </Button>
      <Button
        size="sm"
        variant="light"
        color={color}
        onClick={onRemove}
        px="xxs"
      >
        <XIcon size={12} />
      </Button>
    </Button.Group>
  )
}
