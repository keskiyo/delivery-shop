'use client'

import CatalogMenu from '@/components/layout/header/CatalogDropMenu/CatalogMenu'
import { Category } from '@/types/categories'
import { useCallback, useEffect, useRef, useState } from 'react'

const CatalogMenuWrapper = () => {
	const [isCatalogOpen, setIsCatalogOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [categories, setCategories] = useState<Category[]>([])
	const [isSearchFocused, setIsSearchFocused] = useState(false)
	const searchBlockRef = useRef<HTMLDivElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)

	const fetchCategories = async () => {
		if (categories.length > 0) return

		try {
			const response = await fetch('/api/catalog')
			const data = await response.json()
			setCategories(data)
		} catch (error) {
			setError({
				error:
					error instanceof Error
						? error
						: new Error('Неизвестная ошибка'),
				userMessage: 'Ошибка при получении категорий',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const openMenu = () => {
		if (!isSearchFocused) {
			setIsCatalogOpen(true)
			fetchCategories()
		}
	}

	const handleMouseMove = useCallback(
		(e: MouseEvent) => {
			if (!searchBlockRef.current || !isCatalogOpen || isSearchFocused)
				return

			const isInsideMenu = menuRef.current?.contains(e.target as Node)
			if (isInsideMenu) return

			const searchBlockRect =
				searchBlockRef.current.getBoundingClientRect()

			if (
				e.clientX < searchBlockRect.left ||
				e.clientX > searchBlockRect.right
			) {
				setIsCatalogOpen(false)
			}
		},
		[isCatalogOpen, isSearchFocused],
	)

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove)
		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
		}
	}, [handleMouseMove])

	const handleSearchFocusAction = (focused: boolean) => {
		setIsSearchFocused(focused)
		if (focused) {
			setIsCatalogOpen(false)
		}
	}

	return (
		<CatalogMenu
			isLoading={isLoading}
			categories={categories}
			error={error}
			isCatalogOpen={isCatalogOpen}
			menuRef={menuRef}
			searchBlockRef={searchBlockRef}
			onFocusChangeAction={handleSearchFocusAction}
			onMouseEnter={openMenu}
			setIsCatalogOpen={setIsCatalogOpen}
		/>
	)
}

export default CatalogMenuWrapper
