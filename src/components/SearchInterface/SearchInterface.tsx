import { ActionIcon, ScrollArea, TextInput, UnstyledButton } from '@mantine/core'
import {
  FunnelIcon,
  XIcon,
  PlusIcon,
  ExclamationMarkIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CaretDownIcon,
  CaretUpIcon,
} from '@phosphor-icons/react'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Menu } from '../Menu'
import classes from './SearchInterface.module.css'
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
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const chipsViewport = useRef<HTMLDivElement>(null)
  const [chipsFade, setChipsFade] = useState({ left: false, right: false })

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

  // Fade the chip ribbon's edges only where there is more to scroll to
  const updateChipsFade = useCallback(() => {
    const el = chipsViewport.current
    if (!el) return
    const left = el.scrollLeft > 1
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 1
    setChipsFade((prev) => (prev.left === left && prev.right === right ? prev : { left, right }))
  }, [])

  useEffect(() => {
    updateChipsFade()
    window.addEventListener('resize', updateChipsFade)
    return () => window.removeEventListener('resize', updateChipsFade)
  }, [filters, updateChipsFade])

  // Funnel key: neutral with no filters, accent with filters, red when Option-click would clear them
  const willClear = optionHeld && filterButtonHovered && filters.length > 0
  const filterButtonVariant = willClear ? 'danger' : filters.length > 0 ? 'accent' : 'key'

  // Get current sort label
  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort'

  return (
    <div className={classes.panel}>
      {/* Search input */}
      <TextInput
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        w="100%"
        classNames={{ input: classes.input }}
      />

      {/* Ribbon row: filter icon, selected tags, sort controls */}
      <div className={classes.ribbon}>
        <ActionIcon
          variant={filterButtonVariant}
          size={34}
          className={classes.funnel}
          onClick={handleFilterButtonClick}
          onMouseEnter={() => setFilterButtonHovered(true)}
          onMouseLeave={() => setFilterButtonHovered(false)}
          title={willClear ? 'Clear all filters (Option+Click)' : filtersVisible ? 'Hide filters' : 'Show filters'}
        >
          <FunnelIcon size={16} />
        </ActionIcon>

        {/* Selected tag ribbon */}
        <ScrollArea
          className={classes.chips}
          classNames={{ viewport: classes.chipsViewport }}
          scrollbarSize={0}
          offsetScrollbars
          viewportRef={chipsViewport}
          onScrollPositionChange={updateChipsFade}
          data-fade-left={chipsFade.left || undefined}
          data-fade-right={chipsFade.right || undefined}
        >
          <div className={classes.chipRow}>
            {filters.map((filter) => (
              <FilterChip
                key={filter.tag}
                filter={filter}
                onToggleModifier={() => handleToggleModifier(filter.tag)}
                onRemove={() => handleRemoveFilter(filter.tag)}
              />
            ))}
          </div>
        </ScrollArea>

        {/* Sort controls: split key */}
        <div className={classes.sort} data-open={sortMenuOpen || undefined}>
          <Menu
            items={SORT_OPTIONS.map((option) => ({
              label: option.label,
              selected: option.value === sortBy,
              onClick: () => onSortByChange(option.value),
            }))}
            position="bottom-end"
            onChange={setSortMenuOpen}
          >
            <UnstyledButton className={classes.sortLabel}>
              {currentSortLabel}
              {sortMenuOpen
                ? <CaretUpIcon size={10} className={classes.caret} />
                : <CaretDownIcon size={10} className={classes.caret} />}
            </UnstyledButton>
          </Menu>
          <UnstyledButton className={classes.sortDirection} onClick={handleToggleSortDirection}>
            {sortDirection === 'asc' ? <ArrowUpIcon size={13} /> : <ArrowDownIcon size={13} />}
          </UnstyledButton>
        </div>
      </div>

      {filtersVisible && (
        <>
          {/* Category tabs */}
          <ScrollArea scrollbarSize={4} offsetScrollbars>
            <div className={classes.tabs}>
              {TAG_TAXONOMY.map((category) => {
                const isSelected = category.id === selectedCategory
                const hasFiltersInCategory = filters.some(
                  (f) => f.category === category.id
                )
                return (
                  <UnstyledButton
                    key={category.id}
                    className={classes.tab}
                    data-active={isSelected || undefined}
                    data-has-filters={hasFiltersInCategory || undefined}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {hasFiltersInCategory && <span className={classes.dot} />}
                    {category.label}
                  </UnstyledButton>
                )
              })}
            </div>
          </ScrollArea>
          <div className={classes.divider} />
          {/* Tags for selected category */}
          <div className={classes.tags}>
            {currentTags.map((tag) => {
              const filter = getTagFilter(tag)
              const state = filter ? modifierToState(filter.modifier) : undefined

              return (
                <UnstyledButton
                  key={tag}
                  className={classes.tag}
                  data-state={state}
                  onClick={() => handleTagClick(tag)}
                >
                  {state && <StateIcon state={state} size={10} />}
                  {tagToLabel(tag)}
                </UnstyledButton>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

type FilterState = 'or' | 'include' | 'exclude'

function modifierToState(modifier: FilterModifier): FilterState {
  return modifier === 'none' ? 'or' : modifier
}

function StateIcon({ state, size }: { state: FilterState; size: number }) {
  if (state === 'include') return <PlusIcon size={size} className={classes.stateIcon} data-state={state} />
  // The "!" reads thinner than the "+", so it gets 1px more
  if (state === 'exclude') return <ExclamationMarkIcon size={size + 1} className={classes.stateIcon} data-state={state} />
  return null
}

// Ribbon chip: label cycles the modifier, × removes it
interface FilterChipProps {
  filter: SelectedFilter
  onToggleModifier: () => void
  onRemove: () => void
}

function FilterChip({ filter, onToggleModifier, onRemove }: FilterChipProps) {
  const state = modifierToState(filter.modifier)

  return (
    <div className={classes.chip} data-state={state}>
      <UnstyledButton className={classes.chipLabel} onClick={onToggleModifier}>
        <StateIcon state={state} size={11} />
        {tagToLabel(filter.tag)}
      </UnstyledButton>
      <UnstyledButton className={classes.chipRemove} onClick={onRemove} aria-label={`Remove ${tagToLabel(filter.tag)}`}>
        <XIcon size={11} />
      </UnstyledButton>
    </div>
  )
}
