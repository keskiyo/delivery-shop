import Container from '@/components/ui/container'
import Image from 'next/image'

const SpecialOffers = () => {
	return (
		<section>
			<Container>
				<div className='flex mb-4 md:mb-8 xl:mb-10'>
					<div className='flex flex-col gap-4 md:w-184.25 xl:w-full mx-auto'>
						<h2 className='text-2xl xl:text-4xl text-left font-bold mb-4 md:mb-8'>
							Специальные предложения
						</h2>
						<div className='flex justify-center md:flex-row gap-4 items-center xl:w-auto '>
							<button className='relative w-full md:w-88.25 xl:w-146 h-42.5 xl:h-50 rounded overflow-hidden cursor-pointer hover:shadow-(--shadow-button-default) duration-300'>
								{/* Баннер акций - десктопная версия */}
								<div className='w-full h-full'>
									<Image
										src='/images/banners/banner-action-desk.jpeg'
										alt='Акционные товары'
										width={584}
										height={200}
										className='w-full h-full object-cover rounded'
										priority
									/>
								</div>
							</button>
						</div>
					</div>
				</div>
			</Container>
		</section>
	)
}

export default SpecialOffers
