'use client'

import AddTimeSlotForm from '@/app/(root)/(admin)/administrator/delivery-times/_components/AddTimeSlotForm'
import MessageAlert from '@/app/(root)/(admin)/administrator/delivery-times/_components/MessageAlert'
import SaveButton from '@/app/(root)/(admin)/administrator/delivery-times/_components/SaveButton'
import ScheduleTable from '@/app/(root)/(admin)/administrator/delivery-times/_components/ScheduleTable'
import { sortTimeSlots } from '@/app/(root)/(admin)/administrator/delivery-times/utils/sortTimeSlots'
import { Loader } from '@/components/features/common/loader'
import { useDeliverySchedule } from '@/hooks/useDeliverySchedule'
import { useEffect } from 'react'
import { getDaysDates } from './utils/getDaysDates'

/**
 * Страница управления графиком доставки в админ-панели
 *
 * Функционал:
 * - Просмотр графика доставки на 3 дня вперед
 * - Добавление временных слотов доставки
 * - Включение/выключение слотов для конкретных дат
 * - Удаление временных слотов
 * - Сохранение изменений в базу данных
 *
 * Логика работы:
 * 1. При загрузке получает текущий график доставки с сервера
 * 2. Отображает таблицу с временными слотами и датами
 * 3. Администратор может добавлять новые слоты (начало-конец времени)
 * 4. Для каждого слота можно включить/выключить доступность по датам
 * 5. При нажатии "Сохранить" изменения отправляются на сервер
 *
 * Структура данных:
 * - schedule: объект с датами и массивами доступных временных слотов
 * - timeSlots: массив всех временных слотов
 * - dates: массив дат на 3 дня вперед
 *
 * @route /administrator/delivery-times
 */
export default function DeliveryTimesAdmin() {
	const {
		schedule,
		loading,
		saving,
		message,
		error,
		startTime,
		endTime,
		timeSlots,
		setStartTime,
		setEndTime,
		fetchDeliveryTimes,
		addTimeSlot,
		updateTimeSlotStatus,
		removeTimeSlot,
		saveDeliveryTimes,
	} = useDeliverySchedule()

	const dates = getDaysDates()
	const sortedTimeSlots = sortTimeSlots(timeSlots)

	useEffect(() => {
		fetchDeliveryTimes()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (loading) return <Loader />

	return (
		<div className='container p-3 md:p-4 xl:p-6 w-full mx-auto md:w-auto'>
			<h1 className='text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center'>
				Управление графиком доставки на 3 дня
			</h1>

			<AddTimeSlotForm
				startTime={startTime}
				endTime={endTime}
				onStartTimeChange={setStartTime}
				onEndTimeChange={setEndTime}
				onAddTimeSlot={addTimeSlot}
			/>

			<div className='bg-card rounded border border-#202020 mb-4 md:mb-6 overflow-x-auto'>
				<ScheduleTable
					sortedTimeSlots={sortedTimeSlots}
					dates={dates}
					schedule={schedule}
					onRemoveTimeSlot={removeTimeSlot}
					onUpdateTimeSlotStatus={updateTimeSlotStatus}
				/>
			</div>

			<SaveButton saving={saving} onClick={saveDeliveryTimes} />
			{message && <MessageAlert message={message} />}
			{error && (
				<div className='p-3 md:p-4 mb-4 rounded border bg-[#ffc7c7] text-[#d80000]'>
					{error}
				</div>
			)}
		</div>
	)
}
