import Image from 'next/image'

const SpecialOffers = () => {
	return (
		<section>
			<div className='flex flex-col gap-4 md:w-184.25 xl:w-full mx-auto'>
				<h2 className='mb-4 text-2xl font-bold text-left mb:mb-8 xl:mb-10 xl:text-4xl'>
					Специальные предложения
				</h2>
				<div className='flex items-center justify-center gap-4 md:flex-row xl:w-auto '>
					<button className='relative w-full md:w-88.25 xl:w-146 h-42.5 xl:h-50 rounded overflow-hidden cursor-pointer hover:shadow-button-default transition-custom'>
						<div className='relative w-full h-full'>
							<Image
								src='/images/banners/banner-action-desk.jpeg'
								alt='Акционные товары'
								fill
								unoptimized
								className='object-cover w-full h-full rounded'
								priority
								sizes='(max-width: 767px) 100vw, 353px'
							/>
						</div>
					</button>
				</div>
			</div>
		</section>
	)
}

export default SpecialOffers
