// Назначение: утилита buildSortObject.
// Как работает: Содержит переиспользуемую бизнес-логику, форматирование, расчеты или подготовку данных.

import type { SortField } from '../categories/types'

export const buildSortObject = (
	sortBy: SortField,
	sortOrder: string,
): Record<string, 1 | -1> => {
	const sortDirection: 1 | -1 = sortOrder === 'asc' ? 1 : -1

	switch (sortBy) {
		case 'numericId':
			return { numericId: sortDirection }
		case 'name':
			return { name: sortDirection }
		case 'slug':
			return { slug: sortDirection }
		case 'createdAt':
			return { createdAt: sortDirection }
		case 'author':
			return { author: sortDirection }
		default:
			return { numericId: sortDirection }
	}
}
