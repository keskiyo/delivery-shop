'use client'

import FilterButtons from '@/app/(root)/(category)/category/FilterButtons'
import FilterControls from '@/app/(root)/(category)/category/FilterControls'
import PriceFilter from '@/app/(root)/(category)/category/PriceFilter'
import { X } from 'lucide-react'
import { useState } from 'react'

const DropFilter = ({
	basePath,
	category,
}: {
	basePath: string
	category: string
}) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	return (
		<div className='xl:hidden'>
			<button
				onClick={() => setIsFilterOpen(true)}
				className='ml-3 xl:hidden w-32 h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-green-600 text-white cursor-pointer'
			>
				Фильтр
			</button>
			<div
				className={`xl:hidden flex flex-col gap-y-10 fixed top-0 left-0 bg-card h-screen w-full max-w-90 z-50 p-4 overflow-y-auto shadow-(--shadow-article) transform origin-left transition-all duration-300 ease-in-out ${isFilterOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
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
				/>
			</div>
		</div>
	)
}

export default DropFilter
