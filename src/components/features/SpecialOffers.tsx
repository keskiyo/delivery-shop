import Image from 'next/image'

const SpecialOffers = () => {
	return (
		<section>
			<div className='flex flex-col gap-4 md:w-184.25 xl:w-full mx-auto'>
				<h2 className='mb-4 mb:mb-8 xl:mb-10 text-2xl xl:text-4xl text-left font-bold'>
					Специальные предложения
				</h2>
				<div className='flex justify-center md:flex-row gap-4 items-center xl:w-auto '>
					<button className='relative w-full md:w-88.25 xl:w-146 h-42.5 xl:h-50 rounded overflow-hidden cursor-pointer hover:shadow-button-default transition-custom'>
						<div className='w-full h-full relative'>
							<Image
								src='/images/banners/banner-action-desk.jpeg'
								alt='Акционные товары'
								fill
								className='w-full h-full object-cover rounded'
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
