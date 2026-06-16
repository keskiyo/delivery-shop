import { CategoryBlockProps } from '@/types/categoryBlockProps'
import Image from 'next/image'
import Link from 'next/link'

const GridCategoryBlock = ({
	title,
	img,
	slug,
	priority = false,
}: CategoryBlockProps) => {
	return (
		<Link
			href={`/catalog/${slug}`}
			className='group relative block h-full min-w-40 overflow-hidden rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 md:min-w-56 xl:min-w-68.5'
		>
			<Image
				src={img}
				alt={title}
				fill
				sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				className='object-cover transition-transform group-hover:scale-105'
				priority={priority}
			/>
			<div className='absolute inset-0 bg-linear-to-b from-brand/0 to-brand/80 h-29.25 top-auto group-hover:from-promo/0 group-hover:to-promo group-hover:h-44.25  transition-custom'></div>
			<div className='absolute left-2 bottom-2 right-2 flex items-center'>
				<span className='text-white text-lg font-bold wrap-break-word whitespace-normal max-w-[calc(100%-10px)]'>
					{title}
				</span>
			</div>
		</Link>
	)
}

export default GridCategoryBlock
