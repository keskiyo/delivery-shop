import Image from 'next/image'

import { getImagePath } from '../../../../../../../utils/getImagePath'
import { CategoryImageProps } from '../types/categories.types'

export default function CategoryImage({
	hasImage,
	image,
	imageAlt,
	gradientClass,
	name,
	priority,
}: CategoryImageProps) {
	const imagePath =
		hasImage && image
			? `/api/uploads/blog-categories/${getImagePath(image)}`
			: ''

	return (
		<div className='relative w-full h-48 border-b border-border bg-surface-subtle'>
			{hasImage ? (
				<Image
					src={imagePath}
					alt={imageAlt}
					fill
					className='object-cover'
					sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
					priority={priority}
					quality={75}
					loading={priority ? 'eager' : 'lazy'}
				/>
			) : (
				<div
					className={`flex h-full w-full items-center justify-center bg-linear-to-br ${gradientClass}`}
				>
					<div className='p-4 text-center'>
						<div className='px-4 text-xl font-semibold leading-tight text-primary-foreground'>
							{name}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
