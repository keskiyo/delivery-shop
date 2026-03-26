import SelectCity from '@/app/(root)/(auth)/(reg)/_components/SelectCity'
import SelectRegion from '@/app/(root)/(auth)/(reg)/_components/SelectRegion'
import { profileStyles } from '@/app/(root)/(auth)/styles'
import { useAuthStore } from '@/store/authStore'
import { ChangeEvent, useEffect, useState } from 'react'

interface ProfileFormData {
	region: string
	location: string
}

const LocationSection = ({ isEditing }: { isEditing: boolean }) => {
	const { user, fetchUserData } = useAuthStore()
	const [isSaving, setIsSaving] = useState(false)
	const [formData, setFormData] = useState<ProfileFormData>({
		region: '',
		location: '',
	})

	useEffect(() => {
		if (user) {
			setFormData({
				region: user.region || '',
				location: user.location || '',
			})
		}
	}, [user])

	const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setFormData(prev => ({ ...prev, region: e.target.value }))
	}

	const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setFormData(prev => ({ ...prev, location: e.target.value }))
	}

	const handleCancel = () => {
		setFormData({
			region: user?.region || '',
			location: user?.location || '',
		})
	}

	const handleSave = async () => {
		if (!user?.id) return

		setIsSaving(true)

		try {
			const response = await fetch('/api/auth/location', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: user.id,
					region: formData.region,
					location: formData.location,
				}),
			})

			if (!response.ok) {
				throw new Error('Ошибка сохранения')
			}

			await fetchUserData()
		} catch (error) {
			console.error('Ошибка при сохранении:', error)
			alert('Не удалось сохранить изменения')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className='mb-8'>
			<div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
				<h3 className={profileStyles.sectionTitle}>Местоположение</h3>

				{!isEditing && (
					<div
						className='flex gap-2 w-full md:w-auto invisible'
						aria-hidden='true'
					>
						<button
							className={profileStyles.cancelButton}
							tabIndex={-1}
						>
							Отмена
						</button>
						<button
							className={profileStyles.saveButton}
							tabIndex={-1}
						>
							Сохранить
						</button>
					</div>
				)}

				{isEditing && (
					<div className='flex gap-2 w-full md:w-auto'>
						<button
							onClick={handleCancel}
							className={profileStyles.cancelButton}
						>
							Отмена
						</button>
						<button
							onClick={handleSave}
							className={profileStyles.saveButton}
						>
							{isSaving ? 'Сохранение...' : ' Сохранить'}
						</button>
					</div>
				)}
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<SelectRegion
					value={formData.region}
					onChangeAction={handleRegionChange}
					className='w-full'
					disabled={!isEditing}
				/>
				<SelectCity
					value={formData.location}
					onChangeAction={handleCityChange}
					className='w-full'
					disabled={!isEditing}
				/>
			</div>
		</div>
	)
}

export default LocationSection
