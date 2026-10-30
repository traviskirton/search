import { LinkIcon } from '@phosphor-icons/react'
import { ActionIcon } from '@mantine/core'
import { Menu } from '../Menu'
import classes from './SearchResult.module.css'

export interface Link {
  url: string
  title: string
  type: string
}

export interface DataLineProps {
  tags?: string[]
  links?: Link[]
}

export function DataLine({ tags, links }: DataLineProps) {
  const hasContent = (tags && tags.length > 0) || (links && links.length > 0)

  if (!hasContent) return null

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={classes.dataLine}>
      <div className={classes.badges}>
        {tags?.map((tag) => (
          <span key={tag} className={classes.badge}>
            {tag}
          </span>
        ))}
      </div>
      {links && links.length > 0 && (
        links.length === 1 ? (
          <ActionIcon
            variant="subtle"
            className={classes.link}
            onClick={(e) => {
              e.stopPropagation()
              handleLinkClick(links[0].url)
            }}
            title={links[0].title}
          >
            <LinkIcon />
          </ActionIcon>
        ) : (
          <Menu
            items={links.map((link) => ({
              label: link.title || link.type,
              onClick: () => handleLinkClick(link.url),
            }))}
            position="bottom-end"
          >
            <ActionIcon
              variant="subtle"
              className={classes.link}
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon />
            </ActionIcon>
          </Menu>
        )
      )}
    </div>
  )
}
