interface AddTimeSlotFormProps {
	startTime: string
	endTime: string
	onStartTimeChange: (time: string) => void
	onEndTimeChange: (time: string) => void
	onAddTimeSlot: () => void
}

/**
 * Компонент формы добавления временного слота доставки
 *
 * Функционал:
 * - Ввод времени начала и окончания слота
 * - Кнопка добавления слота для всех дней
 *
 * Используется в:
 * - Страница управления графиком доставки (administrator/delivery-times)
 *
 * Логика:
 * - Слот добавляется сразу для всех дней (сегодня + 2 дня)
 * - Валидация и проверка пересечений выполняется в родительском компоненте (useDeliverySchedule)
 *
 * @param startTime - Время начала слота (формат HH:MM)
 * @param endTime - Время окончания слота (формат HH:MM)
 * @param onStartTimeChange - Callback изменения времени начала
 * @param onEndTimeChange - Callback изменения времени окончания
 * @param onAddTimeSlot - Callback добавления слота
 */
export default function AddTimeSlotForm({
	startTime,
	endTime,
	onStartTimeChange,
	onEndTimeChange,
	onAddTimeSlot,
}: AddTimeSlotFormProps) {
	return (
		<div className='bg-card rounded border border-#202020 p-3 md:p-4 mb-4 md:mb-6'>
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
						className='border rounded px-3 py-2 w-full text-sm md:text-base cursor-text'
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
						className='border rounded px-3 py-2 w-full text-sm md:text-base cursor-text'
					/>
				</div>

				<button
					onClick={onAddTimeSlot}
					className='bg-green-600 text-white hover:shadow-button-default active:shadow-button-active py-2 px-3 md:px-4 rounded whitespace-nowrap text-sm md:text-base w-full md:w-auto duration-300 cursor-pointer'
				>
					Добавить слот
				</button>
			</div>
		</div>
	)
}
