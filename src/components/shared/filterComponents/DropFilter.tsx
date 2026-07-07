'use client'

import { X } from 'lucide-react'
import { useState } from 'react'
import FilterButtons from './FilterButtons'
import FilterControls from './FilterControls'
import PriceFilter from './PriceFilter'

const DropFilter = ({
	basePath,
	category,
	apiEndpoint = '/category',
	userId,
}: {
	basePath: string
	category: string
	apiEndpoint?: string
	userId?: string | null
}) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	return (
		<div className='2xl:hidden'>
			<button
				onClick={() => setIsFilterOpen(true)}
				className='ml-3 flex h-8 w-32 cursor-pointer items-center justify-center gap-x-2 rounded bg-brand p-2 text-xs text-white transition-custom 2xl:hidden'
			>
				Фильтр
			</button>
			<div
				className={`fixed top-0 left-0 z-50 flex h-screen w-full max-w-90 origin-left transform flex-col gap-y-10 overflow-y-auto bg-card p-4 shadow-article transition-custom ease-in-out 2xl:hidden ${isFilterOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
			>
				<div className='flex justify-between items-center mb-4 h-11 rounded text-base font-bold p-2'>
					<h3 className='flex justify-start items-center'>Фильтр</h3>
					<button
						onClick={() => setIsFilterOpen(false)}
						className='text-2xl cursor-pointer'
					>
						<X size={24} />
					</button>
				</div>
				<FilterButtons basePath={basePath} />
				<FilterControls basePath={basePath} />
				<PriceFilter
					basePath={basePath}
					category={category}
					setIsFilterOpenAction={setIsFilterOpen}
					userId={userId}
					apiEndpoint={apiEndpoint}
				/>
			</div>
		</div>
	)
}

export default DropFilter
