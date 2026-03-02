'use client'

import CatalogAdminControls from '@/app/(root)/(catalog)/CatalogAdminControls'
import CatalogGrid from '@/app/(root)/(catalog)/CatalogGrid'
import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { CatalogProps } from '@/types/catalog'
import { useEffect, useState } from 'react'

export const metadata = {
	title: 'Каталог товаров магазина "Фудмаркет"',
	description: 'Каталог всех товаров магазина "Фудмаркет"',
}

const CatalogPage = () => {
	const [categories, setCategories] = useState<CatalogProps[]>([])
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [isEditing, setIsEditing] = useState(false)
	const [draggedCategory, setDraggedCategory] = useState<CatalogProps | null>(
		null,
	)
	const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
		null,
	)
	const isAdmin = true

	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/catalog')
			if (!response.ok) throw new Error('Ошибка получения categories')

			const data: CatalogProps[] = await response.json()

			setCategories(data.sort((a, b) => a.order - b.order))
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

	useEffect(() => {
		fetchCategories()
	}, [])

	const updateOrderInDB = async () => {
		try {
			setIsLoading(true)
			const response = await fetch('/api/catalog', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(
					categories.map((category, index) => ({
						_id: category._id,
						order: index + 1,
						title: category.title,
						img: category.img,
						colSpan: category.colSpan,
						tabletColSpan: category.tabletColSpan,
						mobileColSpan: category.mobileColSpan,
					})),
				),
			})

			if (!response.ok) throw new Error('Ошибка при обновлении порядка')

			await response.json()
		} catch (error) {
			setError({
				error:
					error instanceof Error
						? error
						: new Error('Неизвестная ошибка'),
				userMessage: 'Ошибка изменения порядка категорий',
			})
		} finally {
			setIsLoading(false)
		}
	}

	const handleToggleEditing = async () => {
		if (isEditing) {
			await updateOrderInDB()
		}
		setIsEditing(!isEditing)
	}

	const handleDragStart = (category: CatalogProps) => {
		if (isEditing) {
			setDraggedCategory(category)
		}
	}

	const handleDragOver = (e: React.DragEvent, categoryId: string) => {
		e.preventDefault()
		if (draggedCategory && draggedCategory._id !== categoryId) {
			setHoveredCategoryId(categoryId)
		}
	}

	const handleDragLeave = () => {
		setHoveredCategoryId(null)
	}

	const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
		e.preventDefault()

		if (!isEditing || !draggedCategory) return

		setCategories(prevCategories => {
			const draggedIndex = prevCategories.findIndex(
				c => c._id === draggedCategory._id,
			)
			const targetIndex = prevCategories.findIndex(
				c => c._id === targetCategoryId,
			)

			if (draggedIndex === -1 || targetIndex === -1) return prevCategories

			const newCategories = [...prevCategories]

			const draggedItem = newCategories[draggedIndex]
			const targetItem = newCategories[targetIndex]

			const draggedSizes = {
				mobileColSpan: draggedItem.mobileColSpan,
				tabletColSpan: draggedItem.tabletColSpan,
				colSpan: draggedItem.colSpan,
			}
			const targetSizes = {
				mobileColSpan: targetItem.mobileColSpan,
				tabletColSpan: targetItem.tabletColSpan,
				colSpan: targetItem.colSpan,
			}

			newCategories[draggedIndex] = {
				...targetItem,
				...draggedSizes,
			}
			newCategories[targetIndex] = {
				...draggedItem,
				...targetSizes,
			}

			return newCategories
		})

		setDraggedCategory(null)
		setHoveredCategoryId(null)
	}

	const resetLayout = () => {
		fetchCategories()
	}

	if (isLoading) return <Loader />

	if (error)
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)

	return (
		<section className='px-[max(12px,calc((100%-1208px)/2))] mx-auto mb-20'>
			{isAdmin && (
				<CatalogAdminControls
					isEditing={isEditing}
					toggleEditing={handleToggleEditing}
					resetLayout={resetLayout}
				/>
			)}
			<CatalogGrid
				categories={categories}
				isEditing={isEditing}
				draggedCategory={draggedCategory}
				hoveredCategoryId={hoveredCategoryId}
				handleDragStart={handleDragStart}
				handleDragOver={handleDragOver}
				handleDragLeave={handleDragLeave}
				handleDrop={handleDrop}
			/>
		</section>
	)
}

export default CatalogPage
