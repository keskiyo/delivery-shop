interface ProfileHeaderProps {
	name: string
	surname: string
}

const ProfileHeader = ({ name, surname }: ProfileHeaderProps) => {
	return (
		<div className='bg-linear-to-r from-[#ff6633] to-[#70c05b] px-6 py-8 text-white'>
			<h1 className='text-3xl font-bold'>
				Профиль пользователя: {name} {surname}
			</h1>
			<p className='mt-2 opacity-90'>Управление Вашей учетной записью</p>
		</div>
	)
}

export default ProfileHeader
