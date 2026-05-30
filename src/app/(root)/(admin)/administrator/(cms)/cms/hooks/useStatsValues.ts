import { useCategoryStore } from '@/store/categoryStore'
import { useEffect } from 'react'
import { useSiteSettings } from './useSiteSettings'

export const useStatsValues = () => {
	const { settings } = useSiteSettings()
	const { totalAllItems, loadCategories } = useCategoryStore()

	useEffect(() => {
		loadCategories()
	}, [loadCategories])

	const keywordsCount = settings?.semanticCore?.length || 0

	return {
		categoriesCount: totalAllItems,
		keywordsCount,
		publishedCount: 0,
		viewsCount: 0,
	}
}
