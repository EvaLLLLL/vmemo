import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLevelColor(level: number) {
  switch (level) {
    case 0:
      return 'hsl(var(--chart-5))'
    case 1:
      return 'hsl(var(--chart-2))'
    case 2:
      return 'hsl(var(--chart-3))'
    case 3:
      return 'hsl(var(--chart-4))'
    default:
      return ''
  }
}
