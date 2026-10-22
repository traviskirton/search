import { useState, type ReactNode } from 'react'
import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { ActionIcon, UnstyledButton } from '@mantine/core'
import { Menu, MenuItem } from '../Menu'
import { TypeIcon } from '../TypeIcon'
import classes from './SearchResult.module.css'

export interface SearchResultProps {
  title: string
  description?: string
  dataLine?: ReactNode
  type?: string
  updatedBy?: string
  updatedAt?: string
  onOpen?: () => void
  onAsk?: () => void
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')
}

export function SearchResult({
  title,
  description,
  dataLine,
  type,
  updatedBy,
  updatedAt,
  onOpen,
  onAsk
}: SearchResultProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems: MenuItem[] = [
    { label: 'Open', onClick: onOpen },
    { label: 'Ask', onClick: onAsk },
  ]

  return (
    <UnstyledButton className={classes.result} w="100%" h="100%">
      {/* Title Row */}
      <div className={classes.titleRow}>
        <div className={classes.title}>{title}</div>
        <Menu items={menuItems} onChange={setMenuOpen}>
          <ActionIcon variant="subtle" className={classes.dots} data-open={menuOpen || undefined}>
            <DotsThreeVerticalIcon size={15} />
          </ActionIcon>
        </Menu>
      </div>

      {/* Description & Data */}
      {description && <div className={classes.description}>{description}</div>}
      {dataLine}

      {/* By Line */}
      {(type || updatedBy || updatedAt) && (
        <div className={classes.footer} style={dataLine ? undefined : { marginTop: 'auto' }}>
          {type && (
            <span className={classes.type}>
              <span className={classes.typeTile}>
                <TypeIcon type={type.toLowerCase()} size={13} />
              </span>
              {type}
            </span>
          )}
          {(updatedBy || updatedAt) && (
            <span className={classes.updated}>
              Updated by
              {updatedBy && <span className={classes.avatar}>{initials(updatedBy)}</span>}
              <span className={classes.updatedValue}>
                {[updatedBy, updatedAt].filter(Boolean).join(', ')}
              </span>
            </span>
          )}
        </div>
      )}
    </UnstyledButton>
  )
}
