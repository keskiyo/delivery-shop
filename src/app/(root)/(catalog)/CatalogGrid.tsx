import GridCategoryBlock from '@/app/(root)/(catalog)/GridCategoryBlock'
import { CatalogProps } from '@/types/catalog'

const CatalogGrid = ({
	categories,
	isEditing,
	hoveredCategoryId,
	draggedCategory,
	handleDragOver,
	handleDragLeave,
	handleDrop,
	handleDragStart,
}: {
	isEditing: boolean
	hoveredCategoryId: string | null
	draggedCategory: CatalogProps | null
	handleDragStart: (category: CatalogProps) => void
	handleDragOver: (e: React.DragEvent, categoryId: string) => void
	handleDragLeave: () => void
	handleDrop: (e: React.DragEvent, targetCategoryId: string) => void
	categories: CatalogProps[]
}) => {
	return (
		<div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-8'>
			{categories.map((category, index) => (
				<div
					key={category._id}
					className={`${category.mobileColSpan} ${category.tabletColSpan} ${
						category.colSpan
					} bg-gray-100 rounded overflow-hidden min-h-50 h-full
			${isEditing ? 'border-4 border-dashed border-gray-400' : ''}
			${hoveredCategoryId === category._id ? 'border-3 border-red-800' : ''}
				`}
					onDragOver={e => handleDragOver(e, category._id)}
					onDragLeave={handleDragLeave}
					onDrop={e => handleDrop(e, category._id)}
				>
					<div
						className={`h-full w-full ${
							draggedCategory?._id === category._id
								? 'opacity-50'
								: ' '
						}`}
						draggable={isEditing}
						onDragStart={() => handleDragStart(category)}
					>
						<GridCategoryBlock
							slug={category.slug}
							title={category.title}
							img={category.img}
							priority={index < 4}
						/>
					</div>
				</div>
			))}
		</div>
	)
}

export default CatalogGrid
