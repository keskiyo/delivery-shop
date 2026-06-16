interface AddTimeSlotFormProps {
	startTime: string
	endTime: string
	onStartTimeChange: (time: string) => void
	onEndTimeChange: (time: string) => void
	onAddTimeSlot: () => void
}

export default function AddTimeSlotForm({
	startTime,
	endTime,
	onStartTimeChange,
	onEndTimeChange,
	onAddTimeSlot,
}: AddTimeSlotFormProps) {
	return (
		<div className='bg-card rounded border border-border p-3 md:p-4 mb-4 md:mb-6'>
			<h2 className='text-base md:text-lg font-semibold mb-3 md:mb-4 text-center'>
				Добавить временной слот для всех дней
			</h2>
			<div className='flex flex-col md:flex-row gap-3 md:gap-4 items-center md:items-end justify-center'>
				<div className='w-33'>
					<label className='block text-sm font-medium mb-2'>
						Время начала
					</label>
					<input
						type='time'
						value={startTime}
						onChange={e => onStartTimeChange(e.target.value)}
						className='border border-border bg-card rounded px-3 py-2 w-full text-sm md:text-base cursor-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'
					/>
				</div>

				<div className='w-33'>
					<label className='block text-sm font-medium mb-2'>
						Время окончания
					</label>
					<input
						type='time'
						value={endTime}
						onChange={e => onEndTimeChange(e.target.value)}
						className='border border-border bg-card rounded px-3 py-2 w-full text-sm md:text-base cursor-text focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'
					/>
				</div>

				<button
					onClick={onAddTimeSlot}
					className='bg-brand text-white hover:bg-brand-hover hover:shadow-button-default active:shadow-button-active py-2 px-3 md:px-4 rounded whitespace-nowrap text-sm md:text-base w-full md:w-auto transition-custom cursor-pointer'
				>
					Добавить слот
				</button>
			</div>
		</div>
	)
}
