import Image from 'next/image'

import { CategoryImageProps } from '../types/categories.types'
import { getImagePath } from '../utils/getImagePath'

export default function CategoryImage({
	hasImage,
	image,
	imageAlt,
	gradientClass,
	name,
	priority,
}: CategoryImageProps) {
	const imagePath = getImagePath(hasImage ? image : '')

	return (
		<div className='relative h-48 w-full border-b border-border bg-surface-subtle'>
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
					<div className='text-center p-4'>
						<div className='px-4 text-xl font-semibold leading-tight text-primary-foreground'>
							{name}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
