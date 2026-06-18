'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CookieConsent() {
	const [showConsent, setShowConsent] = useState(false)

	useEffect(() => {
		const consent = localStorage.getItem('cookieConsent')
		if (!consent) {
			setShowConsent(true)
		}
	}, [])

	const acceptCookies = () => {
		localStorage.setItem('cookieConsent', 'true')
		setShowConsent(false)
	}

	if (!showConsent) return null

	return (
		<div className='fixed bottom-0 left-0 right-0 z-50 p-4 text-white bg-gray-900 shadow-lg'>
			<div className='container flex flex-col items-center justify-between gap-4 mx-auto md:flex-row'>
				<p className='text-sm md:text-base'>
					Мы используем файлы cookie для улучшения работы сайта.
					Продолжая пользоваться сайтом, Вы соглашаетесь с{' '}
					<Link href='/policy' className='text-blue-400 underline'>
						политикой конфиденциальности
					</Link>
					.
				</p>
				<button
					onClick={acceptCookies}
					className='px-6 py-2 text-sm text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700 whitespace-nowrap'
				>
					Принять
				</button>
			</div>
		</div>
	)
}
