'use client'

import { Menu, Search } from 'lucide-react'
import Link from 'next/link'

export default function SearchBlock() {
	return (
		<div className='flex flex-row gap-4 items-center grow text-gray-300'>
			<Link
				href='catalog'
				className='hidden md:flex w-auto min-w-18 px-3 py-2 gap-2 items-center shrink-0 rounded hover:text-white transition-colors cursor-pointer bg-orange-500 hover:bg-orange-400'
			>
				<Menu size={24} />
				<span className='text-base hidden lg:block'>Каталог</span>
			</Link>

			<div className='relative min-w-65.25 grow'>
				<input
					type='text'
					placeholder='Найти товар'
					className='w-full h-10 rounded p-2 outline outline-gray-300 text-[#8f8f8f] text-base leading-[150%]'
				/>
				<button className='absolute top-2 right-2 cursor-pointer'>
					<Search size={24} />
				</button>
			</div>
		</div>
	)
}
