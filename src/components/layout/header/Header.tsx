import CatalogMenuWrapper from '@/components/layout/header/CatalogDropMenu/CatalogMenuWrapper'
import UserBlock from '@/components/layout/header/UserBlock'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
	return (
		<header className='relative z-50 w-full bg-site-chrome shadow-default'>
			<div className='flex flex-col items-center justify-between p-2 px-4 mx-auto lg:flex-row lg:py-3 max-w-7xl lg:px-6'>
				<div className='flex flex-row items-center w-full gap-4 px-2 xl:gap-10 lg:w-auto grow'>
					<Link
						href='/'
						className='flex flex-row items-center gap-3 rounded cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40'
						aria-label='На главную страницу'
					>
						<div className='relative w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24'>
							<Image
								src='/web-app-manifest-192x192.png'
								alt='Фудмаркет'
								fill
								sizes='96px'
								loading='eager'
								unoptimized
							/>
						</div>
					</Link>
					<CatalogMenuWrapper />
				</div>
				<div className='flex justify-end w-full mt-4 lg:mt-0 lg:w-auto '>
					<UserBlock />
				</div>
			</div>
		</header>
	)
}

export default Header
