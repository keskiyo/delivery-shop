const CatalogAdminControls = ({
	isEditing,
	toggleEditing,
	resetLayout,
}: {
	isEditing: boolean
	toggleEditing: () => void
	resetLayout: () => void
}) => {
	return (
		<div className='flex justify-end mb-4'>
			<button
				onClick={toggleEditing}
				className='text-sm md:text-base border hover:text-white hover:bg-[#ff6633] hover:border-transparent active:shadow-(--shadow-button-active) w-2/3 h-10 rounded p-2 justify-center items-center transition-all duration-300 cursor-pointer select-none'
			>
				{isEditing ? 'Закончить редактирование' : 'Редактировать'}
			</button>
			{isEditing && (
				<button
					onClick={resetLayout}
					className='ml-3 p-2 text-xs justify-center items-center active:shadow-(--shadow-button-active) rounded cursor-pointer transition-colors duration-300 hover:shadow-(--shadow-button-secondary) border hover:text-white hover:bg-[#ff6633] hover:border-transparent'
				>
					Сбросить
				</button>
			)}
		</div>
	)
}

export default CatalogAdminControls
