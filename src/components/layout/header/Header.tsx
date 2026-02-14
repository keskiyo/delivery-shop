'use client'

import SearchBlock from '@/components/layout/header/SearchBlock'
import { UserBlock } from '@/components/layout/header/UserBlock'
import Container from '@/components/ui/container'
import Image from 'next/image'
import Link from 'next/link'

export function Header({ className }: { className?: string }) {
	return (
		<header
			className={`bg-[#242525] w-full shadow-sm relative z-10 flex flex-col md:flex-row md:items-center md:gap-10 md:p-2 ${className}`}
		>
			<Container>
				<div className='flex items-center justify-between h-16 md:h-20'>
					{/* Левая часть: логотип + SearchBlock */}
					<div className='flex items-center gap-4 xl:gap-10 py-2 px-4 flex-1'>
						<Link
							href='/'
							className='flex flex-row gap-3 items-center cursor-pointer'
						>
							<Image
								src='/web-app-manifest-192x192.png'
								alt='logo'
								width={96}
								height={96}
								className='min-w-12 min-h-12 lg:w-24 lg:h-24'
							/>
						</Link>

						<div className='flex-1 min-w-0'>
							<SearchBlock />
						</div>
					</div>

					{/* Правая часть */}
					<UserBlock />
				</div>
			</Container>
		</header>
	)
}
