import { Metadata } from 'next'
import Image from 'next/image'
import { baseUrl } from '../../../../utils/baseUrl'
export const metadata: Metadata = {
	title: 'О компании Фудмаркета | Наша история и миссия',
	description:
		'Узнайте больше о компании Фудмаркета. Более 20 лет на рынке розничной торговли. Мы предлагаем качественные продукты местного производства по доступным ценам.',
	keywords:
		'о компании, Фудмаркета, история, миссия, розничная торговля, местные продукты, качественные товары',
	alternates: {
		canonical: `${baseUrl}/about-us`,
	},
	openGraph: {
		title: 'О компании Фудмаркета',
		description:
			'Более 20 лет мы заботимся о наших клиентах и предлагаем лучшие местные продукты',
		url: `${baseUrl}/about-us`,
		siteName: 'Фудмаркета',
		images: {
			url: '/og-images/about-us-og.jpg',
			width: 512,
			height: 512,
			alt: 'О компании Фудмаркета',
		},
	},
}

const AboutUsPage = () => {
	return (
		<section className='md:mx-4 xl:mx-12 text-foreground'>
			<div className='relative mb-20 md:mb-25 lg:mb-30'>
				<div className='hidden md:block absolute z-4 w-full h-full max-w-336.25 max-h-100 inset-0'>
					<Image
						src='/images/about-us/bg-top.png'
						alt='О нас'
						fill
						className='object-contain'
					/>
				</div>
				<div className='absolute inset-0 w-full h-full md:hidden z-4'>
					<Image
						src='/images/about-us/bg-top-mob.png'
						alt='О нас'
						fill
						className='object-contain'
					/>
				</div>

				<div className='px-[max(12px,calc((100%-1208px)/2))] flex flex-col mx-auto relative xl:block'>
					<div className='max-w-167.25 w-full relative z-5 xl:ml-10 mt-10'>
						<h1 className='text-4xl md:text-5xl lg:text-[64px] font-bold leading-[150%] mb-1 xl:mb-4'>
							О компании
						</h1>
						<p className='hidden xl:block font-bold text-promo text-2xl max-w-167.25'>
							Мы непрерывно развиваемся и <br />
							работаем над совершенствованием сервиса, заботимся о
							наших клиентах, <br />
							стремимся к лучшему будущему.
						</p>
						<p className='xl:hidden font-bold text-promo text-sm md:text-lg max-w-167.25'>
							Мы непрерывно развиваемся и <br />
							работаем над совершенствованием сервиса, заботимся о
							наших клиентах, стремимся к лучшему будущему.
						</p>
					</div>

					<div className='-mt-12 mx-auto xl:mt-0 xl:absolute xl:right-0 xl:top-5 xl:w-167.25 xl:h-92.75 transform xl:-translate-x-15 overflow-hidden'>
						<div className="xl:absolute inset-0 bg-[url('/images/about-us/bg-right.png')] w-82.5 h-46.75 sm:w-100 sm:h-55 md:w-167.25 md:h-92.75 bg-cover bg-center bg-no-repeat mx-auto"></div>

						<div className='mx-auto xl:inset-0 z-1 w-79 h-34.5 sm:w-93 sm:h-40.5 md:w-155.5 md:h-68.5 top-42 md:top-63 xl:top-25 xl:left-auto xl:right-0 xl:translate-x-0 absolute overflow-hidden left-1/2 -translate-x-1/2'>
							<Image
								src='/images/about-us/people.png'
								alt='Наша компания'
								fill
								className='object-cover'
								sizes='(max-width: 360px) 316px, (max-width: 768px) 372px, 622px'
							/>
						</div>
					</div>
				</div>
			</div>

			<div className='flex flex-col mx-3 mb-20 text-sm gap-y-4 md:gap-y-8 md:mb-25 lg:mb-30'>
				<div className='flex flex-col md:flex-row gap-y-4 md:gap-x-8'>
					<div className='flex gap-x-2.5 items-start'>
						<Image
							src='/images/about-us/check.svg'
							alt='Наша компания'
							width={30}
							height={30}
							className='shrink-0'
						/>
						<div className='flex flex-col flex-1 gap-y-2 wrap-break-word'>
							<p className='lg:text-xl'>
								Мы занимаемся розничной торговлей.
							</p>
							<p className='md:text-lg lg:text-2xl'>
								<b>Более 20 лет.</b>
							</p>
						</div>
					</div>
					<div className='flex gap-x-2.5 items-start'>
						<Image
							src='/images/about-us/check.svg'
							alt='Наша компания'
							width={30}
							height={30}
							className='shrink-0'
						/>
						<div className='flex flex-col flex-1 gap-y-2 wrap-break-word'>
							<p className='lg:text-xl'>
								Основная миссия компании
							</p>
							<p className='md:text-lg lg:text-2xl'>
								<b>
									Максимальное качество товаров и услуг по
									доступной цене.
								</b>
							</p>
						</div>
					</div>
				</div>

				<div className='flex gap-x-2.5 items-start'>
					<Image
						src='/images/about-us/check.svg'
						alt='Наша компания'
						width={30}
						height={30}
						className='shrink-0'
					/>
					<div className='flex flex-col flex-1 gap-y-2 wrap-break-word'>
						<p className='lg:text-xl'>
							Отличительная черта нашей сети
						</p>
						<p className='md:text-lg lg:text-2xl'>
							<b>
								Здоровая и полезная продукция местного
								производства в наших магазинах.
							</b>
						</p>
					</div>
				</div>
			</div>
			<div className='px-10 py-5 lg:py-7.5 w-72.5 md:w-auto h-20.5 md:h-auto md:max-w-87.75 lg:max-w-201.25 text-sm md:text-lg lg:text-2xl text-white font-bold bg-brand rounded-lg flex items-center text-center mx-auto'>
				Спасибо за то, что вы с нами. Фудмаркет, везет всегда!
			</div>
		</section>
	)
}

export default AboutUsPage
