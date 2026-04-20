import DeliveryAddress from '@/app/(root)/(cart)/cart/_components/DeliveryAddress'
import DeliveryTime from '@/app/(root)/(cart)/cart/_components/DeliveryTime'
import {
	DeliveryAddress as DeliveryAddressType,
	DeliveryTime as DeliveryTimeType,
} from '@/types/order'
import { useEffect, useState } from 'react'

interface CheckoutFormProps {
	onFormDataChange: (data: {
		address: DeliveryAddressType
		time: DeliveryTimeType
		isValid: boolean
	}) => void
}

/**
 * Компонент формы оформления заказа
 *
 * Управляет:
 * - Адресом доставки (город, улица, дом, квартира, дополнительная информация)
 * - Временем доставки (дата и временной слот)
 * - Валидацией формы
 *
 * Логика работы:
 * 1. Хранит состояние адреса и времени доставки
 * 2. При каждом изменении проверяет валидность формы
 * 3. Передает данные и статус валидности родительскому компоненту
 * 4. Форма валидна если заполнены: город, улица, дом, дата и временной слот
 *
 * Валидация:
 * - Обязательные поля адреса: city, street, house
 * - Необязательные поля: apartment, additional
 * - Обязательные поля времени: date, timeSlot
 *
 * Используется в:
 * - Страница корзины (cart/page.tsx) для оформления заказа
 */
const CheckoutForm = ({ onFormDataChange }: CheckoutFormProps) => {
	// Состояние адреса доставки
	const [deliveryFormData, setDeliveryFormData] =
		useState<DeliveryAddressType>({
			city: '',
			street: '',
			house: '',
			apartment: '',
			additional: '',
		})

	// Состояние времени доставки
	const [deliveryTime, setDeliveryTime] = useState<DeliveryTimeType>({
		date: '',
		timeSlot: '',
	})

	/**
	 * Эффект для валидации формы и передачи данных родителю
	 * Срабатывает при каждом изменении адреса или времени
	 */
	useEffect(() => {
		// Проверяем заполненность обязательных полей адреса
		const isAddressValid = Boolean(
			deliveryFormData.city &&
			deliveryFormData.street &&
			deliveryFormData.house,
		)

		// Проверяем заполненность времени доставки
		const isTimeValid = Boolean(deliveryTime.date && deliveryTime.timeSlot)

		// Форма валидна только если заполнены все обязательные поля
		const isValid = isAddressValid && isTimeValid

		// Передаем данные и статус валидности родителю
		onFormDataChange({
			address: deliveryFormData,
			time: deliveryTime,
			isValid,
		})
	}, [deliveryFormData, deliveryTime, onFormDataChange])

	/**
	 * Обработчик изменения полей адреса
	 * Обновляет конкретное поле в состоянии адреса
	 */
	const handleFormDataChange = (
		field: keyof DeliveryAddressType,
		value: string,
	) => {
		setDeliveryFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}

	/**
	 * Обработчик изменения даты доставки
	 */
	const handleDateChange = (date: string) => {
		setDeliveryTime(prev => ({
			...prev,
			date,
		}))
	}

	/**
	 * Обработчик изменения временного слота доставки
	 */
	const handleTimeSlotChange = (timeSlot: string) => {
		setDeliveryTime(prev => ({
			...prev,
			timeSlot,
		}))
	}

	return (
		<div className='flex-1 space-y-10'>
			{/* Форма адреса доставки */}
			<DeliveryAddress
				formData={deliveryFormData}
				onFormDataChange={handleFormDataChange}
			/>

			{/* Выбор даты и времени доставки */}
			<DeliveryTime
				selectedDate={deliveryTime.date}
				selectedTimeSlot={deliveryTime.timeSlot}
				onDateChange={handleDateChange}
				onTimeSlotChange={handleTimeSlotChange}
			/>
		</div>
	)
}

export default CheckoutForm
