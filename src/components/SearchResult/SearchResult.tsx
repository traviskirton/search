import type { ReactNode } from 'react'
import { DotsThreeVerticalIcon, UserCircleIcon } from '@phosphor-icons/react'
import { ActionIcon, Box, Group, Stack, Text, UnstyledButton, useMantineTheme } from '@mantine/core'
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
    <UnstyledButton
      className={classes.result}
      bg="white"
      pt="sm"
      pb="sm"
      pl="sm"
      pr="md"
      bd="1px solid gray.3"
      bdrs="md"
      w="100%"
    >
      <Stack gap="md">
        <Stack gap={theme.spacing.xxxs}>
          {/* Title Row */}
        <Group justify="space-between" align="center" gap="xxxs" pl={theme.spacing.xxs}>
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
          <Stack gap="xs" pl={theme.spacing.xxs}>
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
              <Box w="100%" h={16} style={{ display: 'flex', alignItems: 'center' }}>{dataLine}</Box>
            )}
          </Stack>
        )}</Stack>

        {/* By Line */}
        {(type || updatedBy || updatedAt) && (
          <Group justify="space-between" align="start">
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
    </UnstyledButton>
  )
}
