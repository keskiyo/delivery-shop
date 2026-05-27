'use client'

/**
 * Компонент переключателя "В наличии"
 * 
 * Отображает кастомный toggle-переключатель для фильтрации товаров по наличию
 * Используется в фильтрах каталога товаров
 * 
 * @param checked - Текущее состояние переключателя (включен/выключен)
 * @param handleInStockChange - Callback для обработки изменения состояния
 * @param labelText - Текст метки рядом с переключателем (опционально)
 * 
 * Стили:
 * - Выключен: `bg-surface-hover`
 * - Включен: `bg-brand`
 * - Анимация переключения: 300ms
 */
const InStockToggle = ({
	checked,
	handleInStockChange,
	labelText,
}: {
	checked: boolean
	handleInStockChange: (checked: boolean) => void
	labelText?: string
}) => {
	return (
		<div className='flex items-center gap-2'>
			<label className='relative inline-flex items-center cursor-pointer'>
				<input
					type='checkbox'
					id='inStock'
					checked={checked}
					onChange={e => handleInStockChange(e.target.checked)}
					className='sr-only peer'
				/>
				<div className='w-11.5 h-6 bg-surface-hover rounded-full peer peer-checked:bg-brand transition-colors duration-200'>
					<div
						className={`
                absolute top-0.5 left-0
                w-5 h-5
                border-[0.5px] border-border/40
                rounded-full
                shadow-[0px_1px_1px_rgba(0,0,0,0.08),0px_2px_6px_rgba(0,0,0,0.15)]
                bg-card
                transition-transform duration-300
                ${
					checked
						? 'transform translate-x-6'
						: 'transform translate-x-0'
				}
              `}
					></div>
				</div>
				<span className='ml-2 text-sm'>{labelText}</span>
			</label>
		</div>
	)
}

export default InStockToggle
