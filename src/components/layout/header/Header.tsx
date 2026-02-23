'use client'

import SearchBlock from '@/components/layout/header/SearchBlock'
import UserBlock from '@/components/layout/header/UserBlock'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='w-full bg-[#242525] text-gray-300 relative z-10 shadow-(--shadow-default)'>
			<div className='flex flex-col md:flex-row justify-between items-center p-2 md:py-3 mx-auto max-w-7xl px-4 md:px-6'>
				{/* Левая часть: логотип + SearchBlock */}
				<div className='flex flex-row gap-4 xl:gap-10 items-center w-full md:w-auto grow px-2'>
					<Link
						href='/'
						className='flex flex-row gap-3 items-center cursor-pointer shrink-0'
					>
						<div className='relative w-16 h-16 md:w-20 md:h-20 xl:w-24 xl:h-24'>
							<Image
								src='/web-app-manifest-192x192.png'
								alt='logo'
								fill
							/>
						</div>
					</Link>
					<SearchBlock />
				</div>

				{/* Правая часть: UserBlock */}
				<div className='mt-4 md:mt-0 w-full md:w-auto flex justify-end '>
					<UserBlock />
				</div>
			</div>
		</header>
	)
}

export default Header
