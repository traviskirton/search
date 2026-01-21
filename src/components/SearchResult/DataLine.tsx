import { LinkIcon } from '@phosphor-icons/react'
import { ActionIcon, Badge, Group, useMantineTheme } from '@mantine/core'

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

  return (
    <Group w="100%" justify="space-between">
      <Group gap="xxs" wrap="nowrap" style={{ margin: 0, padding: 0 }}>
        {tags?.map((tag) => (
          <Badge key={tag} variant="light" size="xs" color="gray" style={{ cursor: 'inherit' }}>
            {tag}
          </Badge>
        ))}
      </Group>
      {links && links.length > 0 && (
        <ActionIcon variant="subtle" color="gray" size="xs">
          <LinkIcon size={theme.iconSizes.xsmall} />
        </ActionIcon>
      )}
    </Group>
  )
}
