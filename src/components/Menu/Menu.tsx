import { Menu as MantineMenu, MenuProps as MantineMenuProps, useMantineTheme, MantineTheme } from '@mantine/core'
import { CheckIcon } from '@phosphor-icons/react'
import { ReactNode } from 'react'
import './Menu.css'

export type MenuItemType = 'default' | 'danger'

export type MenuItem =
  | { label: string; onClick?: () => void; type?: MenuItemType; selected?: boolean }
  | { label: string; items: MenuItem[] }
  | { divider: true }

export interface MenuProps {
  items: MenuItem[]
  children: ReactNode
  defaultOpened?: boolean
  position?: MantineMenuProps['position']
}

function isDivider(item: MenuItem): item is { divider: true } {
  return 'divider' in item
}

function isSubmenu(item: MenuItem): item is { label: string; items: MenuItem[] } {
  return 'items' in item
}

function renderMenuItem(item: MenuItem, index: number, theme: MantineTheme) {
  if (isDivider(item)) {
    return <MantineMenu.Divider key={index} className="menu-divider"/>
  }

  if (isSubmenu(item)) {
    return (
      <MantineMenu.Sub key={index}>
        <MantineMenu.Sub.Target>
          <MantineMenu.Sub.Item
            fz="md"
            fw={theme.fontWeights.medium}
            lts={theme.letterSpacing.small}
            className='menu-item'
          >
            {item.label}
          </MantineMenu.Sub.Item>
        </MantineMenu.Sub.Target>
        <MantineMenu.Sub.Dropdown>
          {item.items.map((subItem, subIndex) => renderMenuItem(subItem, subIndex, theme))}
        </MantineMenu.Sub.Dropdown>
      </MantineMenu.Sub>
    )
  }

  return (
    <MantineMenu.Item
      fz="md"
      fw={theme.fontWeights.medium}
      lts={theme.letterSpacing.small}
      key={index}
      onClick={item.onClick}
      data-type={item.type}
      className='menu-item'
      style={{ borderRadius: 'var(--mantine-radius-sm)' }}
      rightSection={item.selected ? <CheckIcon size={14} /> : undefined}
    >
      {item.label}
    </MantineMenu.Item>
  )
}

export function Menu({ items, children, defaultOpened, position = 'bottom-end' }: MenuProps) {
  const theme = useMantineTheme()

  return (
    <MantineMenu
      position={position}
      withinPortal
      defaultOpened={defaultOpened}
      shadow='lg'
      radius='md'
    >
      <MantineMenu.Target>{children}</MantineMenu.Target>
      <MantineMenu.Dropdown className='menu-dropdown'>
        {items.map((item, index) => renderMenuItem(item, index, theme))}
      </MantineMenu.Dropdown>
    </MantineMenu>
  )
}
