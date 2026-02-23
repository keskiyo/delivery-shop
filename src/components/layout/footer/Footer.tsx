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
			<footer className='bg-[#242525] text-gray-300 mb-0 w-full mt-10 relative'>
				<div className='px-7 py-10'></div>
			</footer>
		)
	}

	return (
		<footer className='bg-[#242525] text-gray-300 mb-0 w-full mt-20 relative'>
			<div className='max-w-302 mx-auto px-7 py-10 pb-24'>
				{/* Общая обертка для всех элементов футера */}
				<div className='flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10'>
					{/* Блок для социальных сетей и телефона */}
					<div className='flex flex-col md:flex-row items-center gap-6 md:gap-10'>
						{/* Блок социальных сетей */}
						<div className='flex flex-row gap-5 md:flex-col xl:flex-row gap-y-3'>
							<div className='flex gap-x-5 items-center'>
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
										className='hover:opacity-80 transition-opacity duration-300'
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
										className='hover:opacity-80 transition-opacity duration-300'
									/>
								</a>
							</div>
							<div className='flex gap-x-5 items-center'>
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
										className='hover:opacity-80 transition-opacity duration-300'
									/>
								</a>
								<a
									href='https://t.me/Keskiyo'
									target='_blank'
									rel='noopener noreferrer'
									className='flex items-center'
								>
									<Image
										src='/icons-footer/telegram.svg'
										alt='Telegram'
										width={24}
										height={24}
										className='hover:opacity-80 transition-opacity duration-300'
									/>
								</a>
							</div>
						</div>

						{/* Телефон */}
						<div className='phone flex items-center'>
							<a
								href='tel:+78007773333'
								className='flex items-center gap-x-2 hover:opacity-80 transition-opacity duration-300'
							>
								<Phone size={20} />
								<p className='text-base hover:text-gray-100 duration-300'>
									8 800 777 33 33
								</p>
							</a>
						</div>
					</div>

					{/* Навигация */}
					<nav className='nav'>
						<ul className='flex flex-wrap justify-center gap-x-8 text-xs gap-4 xl:gap-y-2 md:gap-x-10'>
							<li className='hover:text-gray-100 cursor-pointer'>
								<Link href='#'>О компании</Link>
							</li>
							<li className='hover:text-gray-100 cursor-pointer'>
								<Link href='#'>Контакты</Link>
							</li>
							<li className='hover:text-gray-100 cursor-pointer'>
								<Link href='#'>Вакансии</Link>
							</li>
							<li className='hover:text-gray-100 cursor-pointer'>
								<Link href='#'>Статьи</Link>
							</li>
							<li className='hover:text-gray-100 cursor-pointer'>
								Политика обработки персональных данных
							</li>
						</ul>
					</nav>
				</div>

				<style jsx>{`
					/* Дополнительные стили для выравнивания */
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
