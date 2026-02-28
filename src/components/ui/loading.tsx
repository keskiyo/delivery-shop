export default function Loading() {
	return (
		<div className='w-full min-h-[60vh] flex flex-col items-center justify-center gap-6'>
			{/* Анимированная иконка */}
			<div className='relative w-20 h-20'>
				{[...Array(3)].map((_, i) => (
					<div
						key={i}
						className='absolute top-0 left-0 w-full h-full border-4 border-t-transparent border-r-transparent border-[#ff6633] rounded-full animate-spin'
						style={{
							animationDuration: `${1 + i * 0.5}s`,
							opacity: 1 - i * 0.3,
						}}
					/>
				))}
			</div>

			{/* Текст с пульсацией */}
			<div className='text-center space-y-2'>
				<p className='text-xl font-medium animate-pulse'>
					Загрузка ...
				</p>
				<p className='text-sm'>Это займет всего несколько секунд</p>
			</div>
		</div>
	)
}
