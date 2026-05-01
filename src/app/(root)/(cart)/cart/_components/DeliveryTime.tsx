import { getDaysDates } from '@/app/(root)/(admin)/administrator/delivery-times/utils/getDaysDates'
import { formStyles } from '@/app/(root)/(auth)/styles'
import DeliveryTimeSkeleton from '@/app/(root)/(cart)/cart/_components/DeliveryTimeSkeleton'
import {
	additionalStyles,
	labelStyles,
	selectStyles,
} from '@/app/(root)/(cart)/cart/_components/styles'
import { formatTimeSlot } from '@/app/(root)/(cart)/cart/utils/formatTimeSlot'
import { isTimeSlotPassed } from '@/app/(root)/(cart)/cart/utils/isTimeSlotPassed'
import { Schedule } from '@/types/deliverySchedule'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DeliveryTimeProps {
	selectedDate: string
	selectedTimeSlot: string
	onDateChange: (date: string) => void
	onTimeSlotChange: (timeSlot: string) => void
}

/**
 * Компонент выбора даты и времени доставки
 *
 * Функционал:
 * - Загружает график доставки из API
 * - Отображает доступные даты (сегодня + 2 дня)
 * - Показывает временные слоты для выбранной даты
 * - Блокирует занятые и прошедшие слоты
 * - Показывает тултипы для недоступных слотов
 *
 * Логика работы:
 * 1. При монтировании загружает график доставки из /api/delivery-times
 * 2. Генерирует список дат (сегодня + 2 дня) в формате DD.MM.YYYY
 * 3. Для выбранной даты получает все временные слоты
 * 4. Проверяет каждый слот: свободен ли (true/false) и не прошел ли (для сегодняшнего дня)
 * 5. Блокирует недоступные слоты и показывает причину в тултипе
 *
 * Форматирование времени:
 * - Мобильная версия: "8-14" (без ведущих нулей и :00)
 * - Десктоп версия: "08.00 - 14.00" (с ведущими нулями и точками вместо двоеточий)
 */
const DeliveryTime = ({
	selectedDate,
	selectedTimeSlot,
	onDateChange,
	onTimeSlotChange,
}: DeliveryTimeProps) => {
	const [availableDates, setAvailableDates] = useState<
		{ value: string; label: string }[]
	>([])
	const [tooltipSlot, setTooltipSlot] = useState<string | null>(null)
	const [schedule, setSchedule] = useState<Schedule>({})
	const [loading, setLoading] = useState(true)

	// Загружает график доставки из API при монтировании компонента
	useEffect(() => {
		const fetchDeliveryTimes = async () => {
			try {
				const response = await fetch('/api/delivery-times')
				const data = await response.json()

				if (data.schedule) {
					setSchedule(data.schedule)
				}
			} catch (error) {
				console.error('Ошибка загрузки графика доставки:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchDeliveryTimes()
	}, [])

	// Генерирует список доступных дат (сегодня + 2 дня)
	// Преобразует формат из YYYY-MM-DD в DD.MM.YYYY для отображения
	useEffect(() => {
		const dates = getDaysDates().map(dateString => {
			const [year, month, day] = dateString.split('-')
			const formattedDate = `${day}.${month}.${year}`

			return {
				value: dateString,
				label: formattedDate,
			}
		})

		setAvailableDates(dates)

		// Автоматически выбираем первую дату, если ничего не выбрано
		if (!selectedDate && dates.length > 0) {
			onDateChange(dates[0].value)
		}
	}, [selectedDate, onDateChange])

	/**
	 * Получает все временные слоты для выбранной даты
	 *
	 * Для каждого слота определяет:
	 * - free: доступен ли слот (не занят и не прошел)
	 * - passed: прошло ли время слота (только для сегодняшнего дня)
	 * - mobileLabel: формат для мобильных ("8-14")
	 * - desktopLabel: формат для десктопа ("08.00 - 14.00")
	 *
	 * @returns Массив слотов с информацией о доступности
	 */
	const getAllTimeSlots = () => {
		if (!schedule[selectedDate]) return []

		const daySchedule = schedule[selectedDate]
		const slots = Object.keys(daySchedule)
			.sort((a, b) => {
				// Сортируем слоты по времени начала
				const [startA] = a.split('-')
				const [startB] = b.split('-')
				return startA.localeCompare(startB)
			})
			.map(slot => {
				const formatted = formatTimeSlot(slot)
				const isFree = daySchedule[slot] !== false // true = свободен, false = занят
				const isPassed = isTimeSlotPassed(slot, selectedDate) // Прошло ли время
				const isAvailable = isFree && !isPassed // Доступен только если свободен и не прошел

				return {
					value: slot,
					mobileLabel: formatted.mobileLabel,
					desktopLabel: formatted.desktopLabel,
					free: isAvailable,
					passed: isPassed,
				}
			})
		return slots
	}

	/**
	 * Обработчик клика по временному слоту
	 * Выбирает слот только если он доступен (свободен и не прошел)
	 */
	const handleTimeSlotClick = (slot: {
		value: string
		free: boolean
		passed?: boolean
	}) => {
		if (slot.free && !slot.passed) {
			onTimeSlotChange(slot.value)
		}
	}

	const timeSlots = getAllTimeSlots()

	if (loading) {
		return <DeliveryTimeSkeleton />
	}

	return (
		<div>
			<h2 className='text-2xl xl:text-4xl font-bold mb-6'>Когда</h2>
			<div className='relative flex flex-col gap-y-4 md:flex-row md:flex-nowrap md:gap-x-8 xl:gap-x-10'>
				{/* Выбор даты */}
				<div>
					<label className={`${labelStyles} text-sm xl:text-base`}>
						Дата
					</label>
					<select
						value={selectedDate}
						onChange={e => onDateChange(e.target.value)}
						className={`${formStyles.input} ${additionalStyles} ${selectStyles} [&&]:md:w-38.75 [&&]:text-base`}
					>
						{availableDates.map(date => (
							<option key={date.value} value={date.value}>
								{date.label}
							</option>
						))}
					</select>
				</div>

				{/* Выбор времени */}
				<div className='flex flex-col w-full'>
					<label className={`${labelStyles} text-sm xl:text-base`}>
						Время
					</label>
					{timeSlots.length === 0 ? (
						<div className='text-center bg-[#ffc7c7] py-2 text-[#d80000] rounded'>
							На выбранную дату нет доставки
						</div>
					) : (
						<div className='text-base grid grid-cols-3 xl:grid-cols-4 gap-2 w-full'>
							{timeSlots.map(slot => (
								<div
									key={slot.value}
									className='relative'
									// Показываем тултип при наведении на недоступный слот
									onMouseEnter={() =>
										(!slot.free || slot.passed) &&
										setTooltipSlot(slot.value)
									}
									onMouseLeave={() => setTooltipSlot(null)}
									onTouchStart={() =>
										(!slot.free || slot.passed) &&
										setTooltipSlot(slot.value)
									}
									onTouchEnd={() => setTooltipSlot(null)}
								>
									<button
										type='button'
										onClick={() =>
											handleTimeSlotClick(slot)
										}
										className={`p-2 rounded justify-center items-center w-full h-10 duration-300  ${
											selectedTimeSlot === slot.value &&
											slot.free &&
											!slot.passed
												? 'bg-green-600 text-white hover:shadow-button-default active:shadow-button-active'
												: slot.free && !slot.passed
													? 'bg-[#f3f2f1] hover:shadow-button-secondary cursor-pointer dark:text-[#8f8f8f]'
													: 'bg-white opacity-50 dark:text-[#8f8f8f] cursor-not-allowed'
										}`}
										disabled={!slot.free || slot.passed}
									>
										{/* Мобильная версия: "8-14" */}
										<span className='xl:hidden text-sm'>
											{slot.mobileLabel}
										</span>

										{/* Десктоп версия: "08.00 - 14.00" */}
										<span className='hidden xl:block text-base'>
											{slot.desktopLabel}
										</span>
									</button>

									{/* Тултип для занятых или прошедших слотов */}
									{(!slot.free || slot.passed) &&
										tooltipSlot === slot.value && (
											<div className='absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2'>
												<div className='bg-[#f4f6fb] text-[#151515] text-sm rounded-[5px] p-2 flex items-center gap-2 whitespace-nowrap shadow-lg'>
													<Clock size={16} />
													{slot.passed
														? 'Это время уже прошло'
														: 'На это время доставить не можем'}
												</div>
												<div className='absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#f4f6fb]'></div>
											</div>
										)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default DeliveryTime
