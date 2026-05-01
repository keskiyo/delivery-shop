import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Утилита для объединения CSS классов
 * 
 * Используется вместо className для правильного объединения классов Tailwind:
 * - clsx объединяет классы (в т.ч. условивые)
 * - twMerge разрешает конфликты (приоритет у последнего класса)
 * 
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', variant === 'primary' && 'text-white')
 * // -> 'px-2 py-1 bg-blue-500 text-white' (если isActive=true, variant='primary')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
