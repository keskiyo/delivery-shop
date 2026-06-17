'use client'

import { Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Footer = () => {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	if (!isClient) {
		return (
			<footer className='relative w-full mt-10 bg-site-chrome text-site-chrome-muted md:mt-15 xl:mt-20'>
				<div className='py-10 px-7'></div>
			</footer>
		)
	}

	return (
		<footer className='relative w-full mt-10 bg-site-chrome text-site-chrome-muted md:mt-15 xl:mt-20'>
			<div className='py-10 pb-24 mx-auto max-w-302 px-7'>
				<div className='flex flex-col items-center justify-between gap-6 md:flex-row md:gap-10'>
					<div className='flex flex-col items-center gap-6 md:flex-row md:gap-10'>
						<div className='flex flex-row gap-5 md:flex-col xl:flex-row gap-y-3'>
							<div className='flex items-center gap-x-5'>
								<a
									href='https://vk.com'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center'
								>
									<Image
										src='/icons-footer/VK.svg'
										alt='VKontakte'
										width={24}
										height={24}
										className='transition-opacity hover:opacity-80 transition-custom'
									/>
								</a>
								<a
									href='https://ok.ru'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center'
								>
									<Image
										src='/icons-footer/OK.svg'
										alt='Odnoklassniki'
										width={24}
										height={24}
										className='transition-opacity hover:opacity-80 transition-custom'
									/>
								</a>
							</div>
							<div className='flex items-center gap-x-5'>
								<a
									href='https://wa.me/78007773333'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center'
								>
									<Image
										src='/icons-footer/wa.svg'
										alt='WhatsApp'
										width={24}
										height={24}
										className='transition-opacity hover:opacity-80 transition-custom'
									/>
								</a>
								<a
									href='https://t.me/'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center'
								>
									<Image
										src='/icons-footer/telegram.svg'
										alt='Telegram'
										width={24}
										height={24}
										className='transition-opacity hover:opacity-80 transition-custom'
									/>
								</a>
							</div>
						</div>

						<div className='flex items-center phone'>
							<a
								href='tel:+78007773333'
								className='flex items-center transition-opacity gap-x-2 hover:opacity-80 transition-custom'
							>
								<Phone size={20} />
								<p className='text-base hover:text-site-chrome-hover transition-custom'>
									8 800 777 33 33
								</p>
							</a>
						</div>
					</div>

					<nav className='nav'>
						<ul className='flex flex-wrap justify-center gap-4 text-xs gap-x-8 xl:gap-y-2 md:gap-x-10'>
							<li className='cursor-pointer hover:text-site-chrome-hover'>
								<Link href='/about-us'>О компании</Link>
							</li>
							<li className='cursor-pointer hover:text-site-chrome-hover'>
								<Link href='/contacts'>Контакты</Link>
							</li>
							<li className='cursor-pointer hover:text-site-chrome-hover'>
								<Link href='/vacancies'>Вакансии</Link>
							</li>
							<li className='cursor-pointer hover:text-site-chrome-hover'>
								<Link href='/blog'>Статьи</Link>
							</li>
							<li className='cursor-pointer hover:text-site-chrome-hover'>
								<Link href='/privacy-policy'>
									Политика обработки персональных данных
								</Link>
							</li>
						</ul>
					</nav>
				</div>

				<style jsx>{`
					.phone {
						align-self: center;
					}

					@media (max-width: 767px) {
						.flex-col {
							align-items: center;
						}

						.phone {
							margin-top: 1rem;
						}
					}

					@media (min-width: 768px) {
						.flex-row {
							justify-content: space-between;
						}
					}
				`}</style>
			</div>
		</footer>
	)
}

export default Footer
