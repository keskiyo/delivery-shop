
import CatalogMenuWrapper from '@/components/layout/header/CatalogDropMenu/CatalogMenuWrapper'
import UserBlock from '@/components/layout/header/UserBlock'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='w-full bg-site-chrome relative z-50 shadow-(--shadow-default)'>
			<div className='flex flex-col lg:flex-row justify-between items-center p-2 lg:py-3 mx-auto max-w-7xl px-4 lg:px-6'>
				{/* Левая часть: логотип + SearchBlock */}
				<div className='flex flex-row gap-4 xl:gap-10 items-center w-full lg:w-auto grow px-2'>
					<Link
						href='/'
						className='flex flex-row gap-3 items-center cursor-pointer shrink-0'
					>
						<div className='relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24'>
							<Image
								src='/web-app-manifest-192x192.png'
								alt='logo'
								fill
								sizes='96px'
								loading='eager'
								unoptimized
							/>
						</div>
					</Link>
					<CatalogMenuWrapper />
				</div>
				{/* Правая часть: UserBlock */}
				<div className='mt-4 lg:mt-0 w-full lg:w-auto flex justify-end '>
					<UserBlock />
				</div>
			</div>
		</header>
	)
}

export default Header
