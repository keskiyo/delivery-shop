'use client'

import { ErrorContent } from '@/app/(root)/(auth)/(reg)/_components/ErrorContent'
import LocationSection from '@/app/(root)/(user-profile)/_components/LocationSection'
import ProfilePhoneSettings from '@/app/(root)/(user-profile)/_components/profile-phone/ProfilePhoneSettings'
import ProfileAvatar from '@/app/(root)/(user-profile)/_components/ProfileAvatar'
import ProfileCard from '@/app/(root)/(user-profile)/_components/ProfileCard'
import ProfileEmail from '@/app/(root)/(user-profile)/_components/ProfileEmail'
import ProfilePassword from '@/app/(root)/(user-profile)/_components/ProfilePassword'
import { Loader } from '@/components/features/common/loader'
import { useAuthStore } from '@/store/authStore'
import { MailWarning, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProfileHeader from '../_components/ProfileHeader'
import SecuritySection from '../_components/SecuritySection'

const ProfilePage = () => {
	const { user, isAuth, checkAuth } = useAuthStore()
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)
	const [isEditing, setIsEditing] = useState(false)
	const router = useRouter()
	const isPhoneRegistration = user?.phoneNumberVerified

	useEffect(() => {
		const checkAuthentication = async () => {
			await checkAuth()
			setIsCheckingAuth(false)
		}
		checkAuthentication()
	}, [checkAuth])

	useEffect(() => {
		if (!isCheckingAuth && !isAuth) {
			router.replace('/')
		}
	}, [isAuth, isCheckingAuth, router])

	const handleToLogin = () => {
		router.replace('/login')
	}

	const handleToRegister = () => {
		router.replace('/register')
	}

	if (isCheckingAuth) {
		return <Loader />
	}

	if (!isAuth) {
		return <Loader />
	}

	if (!user) {
		return (
			<ErrorContent
				error='Данные пользователя не найдены'
				icon={<MailWarning className='h-8 w-8 text-red-600' />}
				primaryAction={{ label: 'Войти', onClick: handleToLogin }}
				secondaryAction={{
					label: 'Зарегистрироваться',
					onClick: handleToRegister,
				}}
			/>
		)
	}

	return (
		<div className='px-4 md:px-6 xl:px-8 max-w-5xl mx-auto'>
			<div className='animate-slide-in opacity translate-y-8 bg-card rounded-xl shadow-xl overflow-hidden duration-300 ease-out'>
				<ProfileHeader name={user.name} surname={user.surname} />

				<div className='p-6 md:p-8'>
					<div className='flex items-center justify-center mb-6'>
						<div className='bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center'>
							{isPhoneRegistration ? (
								<>
									<Phone className='h-4 w-4 mr-1' />
									<span>Зарегистрирован по телефону</span>
								</>
							) : (
								<>
									<MailWarning className='h-4 w-4 mr-1' />
									<span>Зарегистрирован по email</span>
								</>
							)}
						</div>
					</div>
					<ProfileAvatar gender={user.gender || 'male'} />
					<LocationSection isEditing={isEditing} />
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<ProfileEmail isEditing={isEditing} />
						<ProfilePhoneSettings isEditing={isEditing} />
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<ProfilePassword />
						<ProfileCard isEditing={isEditing} />
					</div>
					<SecuritySection
						isEditing={isEditing}
						setIsEditing={setIsEditing}
					/>
				</div>
			</div>
		</div>
	)
}

export default ProfilePage
