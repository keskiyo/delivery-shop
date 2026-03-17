'use client'

import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import { buttonStyles, formStyles } from '@/app/(root)/(auth)/styles'
import { HelpCircle, MailWarning, PlusCircle, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface UnverifiedEmailProps {
	email: string
	setLoginAction: (value: string) => void
	setShowUnverifiedEmailAction: (value: boolean) => void
}

export const UnverifiedEmail = ({
	email,
	setLoginAction,
	setShowUnverifiedEmailAction,
}: UnverifiedEmailProps) => {
	const router = useRouter()
	return (
		<AuthFormLayout>
			<div className='flex flex-col gap-y-4 justify-center items-center'>
				<MailWarning className='h-8 w-8 text-[#ff6633]' />

				<h2 className='text-2xl font-medium tracking-tight'>
					Требуется{' '}
					<span className='text-[#ff6633] font-semibold'>
						подтверждение
					</span>
				</h2>

				<div className='w-full'>
					<div className='w-full rounded p-4 border border-gray-200 shadow-xs flex flex-col items-center'>
						<p className='text-sm font-light'>
							Письмо отправлено на:
						</p>
						<p className='font-medium mt-1 text-lg'>{email}</p>
						<p className='text-xs mt-2 font-light'>
							Проверьте все папки, включая «Спам»
						</p>
					</div>
				</div>
				<div className='flex flex-col gap-y-3'>
					<button
						onClick={() => {
							setLoginAction('')
							setShowUnverifiedEmailAction(false)
						}}
						className={`${buttonStyles.active} rounded [&&]:w-full cursor-pointer`}
					>
						<span className='flex items-center justify-center gap-2 font-medium py-3.5 px-6 text-sm'>
							<PlusCircle className='h-5 w-5' />
							<span className='translate-y-px'>
								Подтвердить и войти заново
							</span>
						</span>
					</button>

					<button
						onClick={() => {
							setLoginAction('')
							setShowUnverifiedEmailAction(false)
						}}
						className={`${formStyles.loginLink} [&&]:h-auto [&&]:my-auto text-green-600 hover:text-white w-full cursor-pointer`}
					>
						<span className='relative flex items-center justify-center gap-2 font-medium py-3.5 px-6 text-sm hover:*:text-white'>
							<Search className='h-5 w-5 text-green-600 transition-colors duration-300' />
							<span className='translate-y-px'>
								Использовать другой email
							</span>
						</span>
					</button>

					<button
						onClick={() => {
							setLoginAction('')
							setShowUnverifiedEmailAction(false)
							router.replace('/contacts')
						}}
						className='w-full rounded border border-gray-200 hover:text-gray-200 duration-300 cursor-pointer'
					>
						<span className='flex items-center justify-center gap-2 font-medium py-3.5 px-6 text-sm'>
							<HelpCircle className='h-5 w-5' />
							<span className='translate-y-px'>
								Связаться с поддержкой
							</span>
						</span>
					</button>
				</div>
			</div>
		</AuthFormLayout>
	)
}
