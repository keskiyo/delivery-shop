'use client'

import { Menu, Search } from 'lucide-react'
import Link from 'next/link'

export default function SearchBlock() {
	return (
		<div className='flex items-center gap-2 w-full text-gray-300'>
			<Link
				href='catalog'
				className='hidden md:flex w-auto min-w-18 px-3 py-2 gap-2 items-center shrink-0 rounded hover:text-white transition-colors cursor-pointer'
			>
				<Menu size={24} />
				<span className='text-sm hidden lg:inline'>Каталог</span>
			</Link>

			<div className='relative w-full pl-1'>
				<input
					type='text'
					placeholder='Найти товар'
					className='w-full h-10 rounded-lg border border-gray-300 bg-transparent px-4 py-2 outline-none placeholder-gray-300 text-base'
				/>
				<button className='absolute inset-y-0 right-3 flex items-center cursor-pointer hover:text-white'>
					<Search size={20} />
				</button>
			</div>
		</div>
	)
}
