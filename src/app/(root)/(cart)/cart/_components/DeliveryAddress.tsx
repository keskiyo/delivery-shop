import { formStyles } from '@/app/(root)/(auth)/styles'
import {
	additionalStyles,
	labelStyles,
	selectStyles,
} from '@/app/(root)/(cart)/cart/_components/styles'
import { cities } from '@/data/city'
import { DeliveryAddress as DeliveryAddressType } from '@/types/order'

interface DeliveryAddressProps {
	formData: DeliveryAddressType
	onFormDataChange: (field: keyof DeliveryAddressType, value: string) => void
}

/**
 * Компонент формы адреса доставки
 * 
 * Функционал:
 * - Выбор населенного пункта из списка
 * - Ввод улицы, дома, квартиры
 * - Дополнительная информация (подъезд, этаж, домофон и т.д.)
 * 
 * Обязательные поля:
 * - Населенный пункт (select из списка городов)
 * - Улица
 * - Дом
 * 
 * Необязательные поля:
 * - Квартира
 * - Дополнительно (подъезд, этаж, код домофона и т.д.)
 * 
 * Особенности:
 * - Адаптивная верстка (колонки на десктопе, строки на мобильных)
 * - Список городов загружается из data/city
 * - Все изменения передаются родителю через onFormDataChange
 * - Валидация required полей на уровне HTML
 * 
 * Используется в:
 * - CheckoutForm - форма оформления заказа в корзине
 * 
 * @param formData - Объект с данными адреса
 * @param onFormDataChange - Callback для обновления конкретного поля
 */
const DeliveryAddress = ({
	formData,
	onFormDataChange,
}: DeliveryAddressProps) => {
	return (
		<>
			<h2 className='text-2xl xl:text-4xl font-bold mb-6'>Куда</h2>
			<div className='flex flex-col gap-y-4 xl:flex-row xl:flex-nowrap md:gap-x-8 xl:gap-x-10'>
				<div className='flex flex-col gap-y-4 md:flex-row md:w-full md:justify-between md:gap-x-8'>
					<div className='md:flex-1'>
						<label className={labelStyles}>
							Населенный пункт *
						</label>
						<select
							value={formData.city}
							onChange={e =>
								onFormDataChange('city', e.target.value)
							}
							className={`${formStyles.input} ${additionalStyles} ${selectStyles}`}
							required
						>
							{cities.map(city => (
								<option key={city.value} value={city.value}>
									{city.label}
								</option>
							))}
						</select>
					</div>

					<div className='md:flex-1'>
						<label className={labelStyles}>Улица</label>
						<input
							type='text'
							value={formData.street}
							onChange={e =>
								onFormDataChange('street', e.target.value)
							}
							className={`${formStyles.input} ${additionalStyles}`}
							required
						/>
					</div>
				</div>

				<div className='flex flex-row gap-x-4 md:gap-x-8 xl:gap-x-10'>
					<div className='flex-1'>
						<label className={labelStyles}>Дом</label>
						<input
							type='text'
							value={formData.house}
							onChange={e =>
								onFormDataChange('house', e.target.value)
							}
							className={`${formStyles.input} ${additionalStyles} [&&]:min-w-16.75`}
							required
						/>
					</div>

					<div className='flex-1'>
						<label className={labelStyles}>Квартира</label>
						<input
							type='text'
							value={formData.apartment}
							onChange={e =>
								onFormDataChange('apartment', e.target.value)
							}
							className={`${formStyles.input} ${additionalStyles}`}
						/>
					</div>

					<div className='flex-1'>
						<label className={labelStyles}>Дополнительно</label>
						<input
							value={formData.additional}
							onChange={e =>
								onFormDataChange('additional', e.target.value)
							}
							className={`${formStyles.input} ${additionalStyles}`}
						/>
					</div>
				</div>
			</div>
		</>
	)
}

export default DeliveryAddress
