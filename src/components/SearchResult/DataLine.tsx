import { LinkIcon } from '@phosphor-icons/react'
import { ActionIcon, Badge, Group, Text, useMantineTheme } from '@mantine/core'
import { Menu } from '../Menu'

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
  const theme = useMantineTheme()
  const hasContent = (tags && tags.length > 0) || (links && links.length > 0)

  if (!hasContent) return null

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Group w="100%" justify="space-between" wrap="nowrap" style={{ overflow: 'hidden' }}>
      <Group gap="xxs" wrap="nowrap" style={{ overflow: 'hidden', flex: 1 }}>
        {tags?.map((tag) => (
          <Badge key={tag} variant="light" size="xs" color="gray" style={{ cursor: 'inherit' }}>
            {tag}
          </Badge>
        ))}
      </Group>
      {links && links.length > 0 && (
        links.length === 1 ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="xs"
            onClick={(e) => {
              e.stopPropagation()
              handleLinkClick(links[0].url)
            }}
            title={links[0].title}
          >
            <LinkIcon size={theme.iconSizes.xsmall} />
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
              color="gray"
              size="xs"
              onClick={(e) => e.stopPropagation()}
            >
              <LinkIcon size={theme.iconSizes.xsmall} />
            </ActionIcon>
          </Menu>
        )
      )}
    </Group>
  )
}
