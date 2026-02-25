import { CategoryBlockProps } from '@/types/categoryBlockProps'
import Image from 'next/image'
import Link from 'next/link'

const GridCategoryBlock = ({ id, title, img }: CategoryBlockProps) => {
	return (
		<Link
			href={`category-${id}`}
			className='block relative h-full overflow-hidden group min-w-40 md:min-w-56 xl:min-w-68.5'
		>
			<Image
				src={img}
				alt={title}
				fill
				sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
				className='object-cover transition-transform group-hover:scale-105'
				priority={false}
			/>
			<div
				className='absolute inset-0 bg-[linear-gradient(180deg,rgba(112,192,91,0)_0%,rgba(112,192,91,0.82)_82.813%)] h-29.25 top-auto
                  group-hover:bg-[linear-gradient(180deg,rgba(255,102,51,0)_0%,rgba(255,102,51,1)_100%)] group-hover:h-44.25 transition-all duration-300'
			></div>
			<div className='absolute left-2.5 bottom-2.5 flex items-center'>
				<span className='text-white text-lg font-bold'>{title}</span>
			</div>
		</Link>
	)
}

export default GridCategoryBlock
