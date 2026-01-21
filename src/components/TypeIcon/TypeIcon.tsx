import {
  MapPinIcon,
  PackageIcon,
  BuildingsIcon,
  BookIcon,
  FilmSlateIcon,
  CarIcon,
  PlanetIcon,
  BuildingIcon,
  QuestionIcon,
  Icon as PhosphorIcon,
  FinnTheHumanIcon,
  PersonSimpleCircleIcon,
} from '@phosphor-icons/react'
import { useMantineTheme } from '@mantine/core'

export type EntityType =
  | 'person'
  | 'character'
  | 'location'
  | 'item'
  | 'organization'
  | 'book'
  | 'movie'
  | 'vehicle'
  | 'franchise'
  | 'company'

const iconMap: Record<EntityType, PhosphorIcon> = {
  person: PersonSimpleCircleIcon,
  character: FinnTheHumanIcon,
  location: MapPinIcon,
  item: PackageIcon,
  organization: BuildingsIcon,
  book: BookIcon,
  movie: FilmSlateIcon,
  vehicle: CarIcon,
  franchise: PlanetIcon,
  company: BuildingIcon,
}

export interface TypeIconProps {
  type: EntityType | string
  size?: number
  color?: string
}

export function TypeIcon({ type, size = 18, color }: TypeIconProps) {
  const theme = useMantineTheme()
  const IconComponent = iconMap[type as EntityType] || QuestionIcon
  const iconColor = color || theme.colors.gray[7]

  return <IconComponent size={size} color={iconColor} />
}

export const entityTypes = Object.keys(iconMap) as EntityType[]
