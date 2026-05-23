import { EmptyState } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/EmptyState'
import { SortableItem } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/SortableItem'
import { TableHeader } from '@/app/(root)/(admin)/administrator/(cms)/cms/categories/_components/TableHeader'
import {
	Category,
	CategoryTableProps,
} from '@/app/(root)/(admin)/administrator/(cms)/cms/types'
import { useCategoryStore } from '@/store/categoryStore'

export const CategoryTable = ({ onDelete, onEdit }: CategoryTableProps) => {
	const { categories, loading } = useCategoryStore()
	const getDisplayNumericId = (category: Category): number | null => {
		return category.numericId
	}

	if (loading) {
		return <div className='text-center p-8'>Загрузка категорий ...</div>
	}
	return (
		<>
			<TableHeader />
			<div className='divide-y divide-gray-200'>
				{categories.length === 0 ? (
					<EmptyState />
				) : (
					categories.map(category => {
						const categoryId = category._id.toString()

						return (
							<SortableItem
								key={categoryId}
								category={category}
								displayNumericId={getDisplayNumericId(category)}
								onDelete={onDelete}
								onEdit={onEdit}
							/>
						)
					})
				)}
			</div>
		</>
	)
}
