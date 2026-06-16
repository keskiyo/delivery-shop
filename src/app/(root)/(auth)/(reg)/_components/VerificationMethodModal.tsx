'use client'

import { AuthFormLayout } from '@/app/(root)/(auth)/_components/AuthFormLayout'
import { verificationButtonStyles } from '@/app/(root)/(auth)/styles'
import { useRegFormContext } from '@/app/contexts/RegFormContext'
import { Mail, Smartphone } from 'lucide-react'
import Link from 'next/link'

const VerificationMethodModal = () => {
	const { regFormData } = useRegFormContext()
	const { phoneNumber, email } = regFormData

	const iconContainerStyles = `
    p-3 mb-4 rounded-full bg-promo-soft
    group-hover:bg-promo transition-custom
  `

	return (
		<AuthFormLayout>
			<div className='animate-in zoom-in-95 relative'>
				<div className='space-y-6 flex flex-col items-center'>
					<div className='text-center'>
						<h2 className='text-3xl font-bold mb-2'>
							Подтверждение аккаунта
						</h2>
						<p>
							Выберите удобный способ подтверждения для завершения
							регистрации
						</p>
					</div>

					<div className='space-y-4'>
						<Link
							href='/verify/verify-phone'
							className={verificationButtonStyles}
						>
							<div className={iconContainerStyles}>
								<Smartphone className='h-6 w-6 text-promo group-hover:text-white' />
							</div>
							<span className='font-medium'>
								По SMS на телефон
							</span>
							<span className='text-sm mt-1 text-muted-foreground'>
								+{phoneNumber}
							</span>
							<div className='absolute top-0 right-0 -mt-2 -mr-2'>
								<span className='flex h-4 w-4'>
									<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-promo opacity-75'></span>
									<span className='relative inline-flex rounded-full h-4 w-4 bg-promo'></span>
								</span>
							</div>
						</Link>

						<div className='flex items-center my-2'>
							<div className='grow border-t border-border'></div>
							<span className='mx-4 text-sm'>или</span>
							<div className='grow border-t border-border'></div>
						</div>

						<Link
							href='/verify/verify-email'
							className={verificationButtonStyles}
						>
							<div className={iconContainerStyles}>
								<Mail className='h-6 w-6 text-promo group-hover:text-white' />
							</div>
							<span className='font-medium'>
								По ссылке на email
							</span>
							<span className='text-sm  mt-1 text-muted-foreground'>
								{email}
							</span>
						</Link>
					</div>
				</div>
			</div>
		</AuthFormLayout>
	)
}

export default VerificationMethodModal
