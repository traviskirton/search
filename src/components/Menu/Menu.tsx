import { Menu as MantineMenu, MenuProps as MantineMenuProps } from '@mantine/core'
import { ReactNode } from 'react'
import './Menu.css'

export type MenuItemType = 'default' | 'danger'

export type MenuItem =
  | { label: string; onClick?: () => void; type?: MenuItemType }
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

function renderMenuItem(item: MenuItem, index: number) {
  if (isDivider(item)) {
    return <MantineMenu.Divider key={index} />
  }

  if (isSubmenu(item)) {
    return (
      <MantineMenu.Sub key={index}>
        <MantineMenu.Sub.Target>
          <MantineMenu.Sub.Item>{item.label}</MantineMenu.Sub.Item>
        </MantineMenu.Sub.Target>
        <MantineMenu.Sub.Dropdown>
          {item.items.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
        </MantineMenu.Sub.Dropdown>
      </MantineMenu.Sub>
    )
  }

  return (
    <MantineMenu.Item
      key={index}
      onClick={item.onClick}
      data-type={item.type}
      style={{ borderRadius: 'var(--mantine-radius-sm)' }}
    >
      {item.label}
    </MantineMenu.Item>
  )
}

export function Menu({ items, children, defaultOpened, position = 'bottom-end' }: MenuProps) {
  return (
    <MantineMenu
      position={position}
      withinPortal
      defaultOpened={defaultOpened}
      shadow='lg'
      radius='md'
      
      classNames={{
        dropdown: 'menu-dropdown',
        item: 'menu-item',
        divider: 'menu-divider',
        label: 'menu-label',
      }}
    >
      <MantineMenu.Target>{children}</MantineMenu.Target>
      <MantineMenu.Dropdown>
        {items.map((item, index) => renderMenuItem(item, index))}
      </MantineMenu.Dropdown>
    </MantineMenu>
  )
}
