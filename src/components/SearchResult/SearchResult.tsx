import { useState, type ReactNode } from 'react'
import { DotsThreeVerticalIcon } from '@phosphor-icons/react'
import { ActionIcon, UnstyledButton } from '@mantine/core'
import { Menu, MenuItem } from '../Menu'
import { TypeIcon } from '../TypeIcon'
import { tagToLabel } from '../../tag-taxonomy'
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
  // Mantine menus are costly to mount, so a card builds its menu on first hover or focus
  const [menuMounted, setMenuMounted] = useState(false)
  const mountMenu = () => setMenuMounted(true)

  const menuItems: MenuItem[] = [
    { label: 'Open', onClick: onOpen },
    { label: 'Ask', onClick: onAsk },
  ]

  const dots = (
    <ActionIcon variant="subtle" className={classes.dots} data-open={menuOpen || undefined}>
      <DotsThreeVerticalIcon />
    </ActionIcon>
  )

  return (
    <UnstyledButton className={classes.result} w="100%" h="100%" onPointerEnter={mountMenu} onFocus={mountMenu}>
      {/* Title Row */}
      <div className={classes.titleRow}>
        <div className={classes.title}>{title}</div>
        {menuMounted ? (
          <Menu items={menuItems} onChange={setMenuOpen}>
            {dots}
          </Menu>
        ) : (
          dots
        )}
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
                <TypeIcon type={type.toLowerCase()} />
              </span>
              {tagToLabel(type.toLowerCase())}
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
