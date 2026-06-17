import Image from 'next/image'
import { ArticleImageProps } from '../../../types'

const ArticleImage = ({ image, imageAlt, articleName }: ArticleImageProps) => {
	if (!image) {
		return null
	}

	return (
		<div className='mb-8 overflow-hidden rounded-md border border-border bg-card shadow-default'>
			<Image
				width={800}
				height={450}
				src={image}
				alt={imageAlt || articleName}
				className='h-auto max-h-96 w-full object-cover'
				priority
			/>
		</div>
	)
}

export default ArticleImage
