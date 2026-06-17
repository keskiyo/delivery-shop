import Image from 'next/image'
import { getImagePath } from '../../../../../../../utils/getImagePath'
import { CategoryImageProps } from '../../types'

const CategoryImage = ({
	category,
	gradientColor,
	hasImage,
}: CategoryImageProps) => {
	if (hasImage && category.image) {
		const imagePath =
			hasImage && category.image
				? `/api/uploads/blog-categories/${getImagePath(category.image)}`
				: ''

		return (
			<div className='relative w-full mx-auto mb-6 overflow-hidden rounded shadow-lg max-w-100 h-50 md:h-50'>
				<Image
					src={imagePath}
					alt={category.imageAlt || category.name}
					fill
					className='object-cover'
					priority
					sizes='(max-width: 800px) 100vw, 800px'
				/>
				<div className='absolute inset-0 bg-linear-to-t from-black/30 to-transparent' />
			</div>
		)
	}

	return (
		<div
			className={`flex h-52 w-full items-center justify-center overflow-hidden rounded-md border border-border bg-linear-to-br shadow-default sm:h-64 ${gradientColor}`}
		>
			<div className='max-w-2xl px-6 text-center text-primary-foreground'>
				<h2 className='mb-3 text-2xl font-bold sm:text-3xl'>
					{category.name}
				</h2>
				{category.description && (
					<p className='text-base leading-7 text-primary-foreground/90 sm:text-lg'>
						{category.description}
					</p>
				)}
			</div>
		</div>
	)
}

export default CategoryImage
