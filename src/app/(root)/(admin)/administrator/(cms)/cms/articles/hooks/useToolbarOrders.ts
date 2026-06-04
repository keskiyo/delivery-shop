// Назначение: React-хук useToolbarOrders.
// Как работает: Инкапсулирует состояние, эффекты и обработчики, чтобы компоненты не дублировали эту логику.

import { ToolbarGroup } from '@/app/(root)/(admin)/administrator/(cms)/cms/articles/types/tiptap'
import { useEffect, useState } from 'react'
import {
	CONFIG_GROUPS,
	CONFIG_TOOLBAR_COMPONENTS,
} from '../utils/CONFIG_TOOLBAR'

const isKnownToolbarGroup = (group: unknown): group is ToolbarGroup => {
	if (!group || typeof group !== 'object') return false

	const toolbarGroup = group as ToolbarGroup

	return (
		typeof toolbarGroup.id === 'string' &&
		typeof toolbarGroup.name === 'string' &&
		Array.isArray(toolbarGroup.items) &&
		toolbarGroup.items.every(item => item in CONFIG_TOOLBAR_COMPONENTS)
	)
}

const normalizeToolbarGroups = (groups: unknown): ToolbarGroup[] => {
	const parsedGroups = Array.isArray(groups) ? groups : []
	const validGroups = parsedGroups.filter(isKnownToolbarGroup)
	const knownGroupIds = new Set(validGroups.map(group => group.id))
	const missingDefaultGroups = CONFIG_GROUPS.filter(
		group => !knownGroupIds.has(group.id),
	)

	return [...validGroups, ...missingDefaultGroups]
}

export const useToolbarOrder = () => {
	const [groups, setGroups] = useState<ToolbarGroup[]>(() => {
		try {
			const saved = localStorage.getItem('toolbar-order')
			if (saved) {
				const parsed = JSON.parse(saved)
				return normalizeToolbarGroups(parsed)
			}
		} catch (error) {
			console.error('Ошибка загрузки порядка компонентов:', error)
		}

		return normalizeToolbarGroups(CONFIG_GROUPS)
	})

	useEffect(() => {
		try {
			localStorage.setItem('toolbar-order', JSON.stringify(groups))
		} catch (error) {
			console.error('Error saving toolbar order:', error)
		}
	}, [groups])

	const moveGroup = (fromIndex: number, toIndex: number) => {
		if (fromIndex === toIndex) return

		setGroups(prev => {
			const newGroups = [...prev]
			const [movedGroup] = newGroups.splice(fromIndex, 1)
			newGroups.splice(toIndex, 0, movedGroup)
			return newGroups
		})
	}

	return { groups, moveGroup }
}
