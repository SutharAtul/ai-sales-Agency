import { iconPaths } from './icons'
import type { IconName } from '@/types'

interface IconProps {
  /** Icon name from the built-in icon set */
  name: IconName
  /** Pixel size (width & height). @default 18 */
  size?: number
  /** Additional CSS class names */
  className?: string
  /** Accessible label — if omitted the icon is decorative (aria-hidden) */
  label?: string
}

/**
 * Inline SVG icon using the built-in JusBid icon set.
 * Inherits `currentColor` for stroke so it responds to text color utilities.
 */
export function Icon({ name, size = 18, className, label }: IconProps) {
  return (
    <svg
      aria-hidden={!label}
      aria-label={label}
      role={label ? 'img' : undefined}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={iconPaths[name]} />
    </svg>
  )
}

