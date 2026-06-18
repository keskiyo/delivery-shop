'use client'

import { buttonStyles } from '@/app/(root)/(auth)/styles'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthFormLayout } from '../../../_components/AuthFormLayout'

export default function VerifySuccessPage() {
	const router = useRouter()
	const [secondsLeft, setSecondsLeft] = useState(5)

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push('/login')
		}, 5000)

		const interval = setInterval(() => {
			setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0))
		}, 1000)

		return () => {
			clearTimeout(timer)
			clearInterval(interval)
		}
	}, [router])

	return (
		<AuthFormLayout>
			<div className='p-8 text-center'>
				<div className='flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-success'>
					<CheckCircle className='w-10 h-10 text-white' />
				</div>

				<h1 className='mb-2 text-2xl font-bold'>
					Email успешно подтвержден!
				</h1>

				<p className='mb-6 text-muted-foreground'>
					Ваш адрес электронной почты был успешно подтвержден. Теперь
					Вы можете войти в свой аккаунт.
				</p>

				<div className='space-y-4'>
					<button
						onClick={() => router.replace('/login')}
						className={`${buttonStyles.active} px-4 py-2 rounded cursor-pointer w-full`}
					>
						Перейти к авторизации
					</button>

					<p className='text-sm text-muted-foreground'>
						Автоматический переход через {secondsLeft}{' '}
						{secondsLeft % 10 === 1 && secondsLeft % 100 !== 11
							? 'секунду'
							: secondsLeft % 10 >= 2 &&
								  secondsLeft % 10 <= 4 &&
								  (secondsLeft % 100 < 10 ||
										secondsLeft % 100 >= 20)
								? 'секунды'
								: 'секунд'}
						...
					</p>
				</div>
			</div>

			<div className='px-8 py-4 border-t bg-surface border-border'>
				<p className='text-xs text-center text-muted-foreground'>
					Нужна помощь?{' '}
					<Link
						href='/contacts'
						className='text-promo hover:underline'
					>
						Свяжитесь с поддержкой
					</Link>
				</p>
			</div>
		</AuthFormLayout>
	)
}
