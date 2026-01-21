import { DotsThreeVerticalIcon, UserCircleIcon } from '@phosphor-icons/react'
import { ActionIcon, Box, Group, Stack, Text, useMantineTheme } from '@mantine/core'
import { Menu, MenuItem } from '../Menu'
import { TypeIcon } from '../TypeIcon'

export interface SearchResultProps {
  title: string
  description?: string
  dataLine?: string
  type?: string
  updatedBy?: string
  updatedAt?: string
  onOpen?: () => void
  onAsk?: () => void
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
  const theme = useMantineTheme()

  const menuItems: MenuItem[] = [
    { label: 'Open', onClick: onOpen },
    { label: 'Ask', onClick: onAsk },
  ]

  return (
    <Box bg="white" p="lg" pb="xs" bdrs="sm">
      <Stack gap="xs">
        {/* Title Row */}
        <Group justify="space-between" align="center" gap="xxxs">
          <Text
            fw={theme.fontWeights.semibold}
            fz="xl"
            c="gray.8"
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}
          >
            {title}
          </Text>
          <Menu items={menuItems}>
            <ActionIcon variant="subtle" color="gray" size="sm">
              <DotsThreeVerticalIcon size={16} weight="bold" />
            </ActionIcon>
          </Menu>
        </Group>

        {/* Description & Data */}
        {(description || dataLine) && (
          <Stack gap="sm">
            {description && (
              <Text
                fz="md"
                c="gray.9"
                lineClamp={2}
              >
                {description}
              </Text>
            )}
            {dataLine && (
              <Text fz="sm" c="gray." fw={theme.fontWeights.medium}>
                {dataLine}
              </Text>
            )}
          </Stack>
        )}

        {/* By Line */}
        {(type || updatedBy || updatedAt) && (
          <Group justify="space-between" align="center">
            {type && (
              <Group gap="xxs" p="xxxs">
                <TypeIcon type={type.toLowerCase()} />
                <Text fz="sm" c="gray.9">{type}</Text>
              </Group>
            )}
            {(updatedBy || updatedAt) && (
              <Group gap="xxs">
                <Text fz="xs" c="gray.7">Updated by</Text>
                <UserCircleIcon size={12} color={theme.colors.gray[7]} />
                {updatedBy && <Text fz="xs" c="gray.9">{updatedBy}</Text>}
                {updatedAt && <Text fz="xs" c="gray.9">{updatedAt}</Text>}
              </Group>
            )}
          </Group>
        )}
      </Stack>
    </Box>
  )
}
