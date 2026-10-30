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
import classes from './TypeIcon.module.css'

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
  /** Without a size, tokens.css sizes the icon (or its parent does, e.g. a type tile) */
  size?: number
  color?: string
}

export function TypeIcon({ type, size, color }: TypeIconProps) {
  const IconComponent = iconMap[type as EntityType] || QuestionIcon

  return (
    <IconComponent
      size={size}
      className={size === undefined ? classes.icon : undefined}
      style={{ color: color ?? 'var(--sc-ink)' }}
    />
  )
}

export const entityTypes = Object.keys(iconMap) as EntityType[]
