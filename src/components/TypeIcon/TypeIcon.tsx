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
  DiamondIcon,
} from '@phosphor-icons/react'

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
  | 'artifact'

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
  artifact: DiamondIcon,
}

export interface TypeIconProps {
  type: EntityType | string
  size?: number
  color?: string
}

export function TypeIcon({ type, size = 18, color }: TypeIconProps) {
  const IconComponent = iconMap[type as EntityType] || QuestionIcon

  return <IconComponent size={size} style={{ color: color ?? 'var(--sc-ink)' }} />
}

export const entityTypes = Object.keys(iconMap) as EntityType[]
