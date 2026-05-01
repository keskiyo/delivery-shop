'use client'

/**
 * Мобильная версия фильтров (выпадающая панель)
 * 
 * Функционал:
 * - Кнопка "Фильтр" для открытия панели (только на мобильных, xl:hidden)
 * - Панель выезжает слева (slide-in анимация)
 * - Содержит все элементы фильтрации:
 *   - FilterButtons (товары нашего производства, полезные, без ГМО)
 *   - FilterControls (сортировка)
 *   - PriceFilter (диапазон цен, в наличии)
 * - Кнопка закрытия (X) в верхней части
 * 
 * Адаптивность:
 * - Показывается только на мобильных (xl:hidden)
 * - На десктопе используются статичные фильтры
 * 
 * @param basePath - Базовый путь для формирования URL
 * @param category - Текущая категория
 * @param apiEndpoint - API endpoint для получения данных (по умолчанию /category)
 * @param userId - ID пользователя для персонализации
 */
import { X } from 'lucide-react'
import { useState } from 'react'
import FilterButtons from './FilterButtons'
import FilterControls from './FilterControls'
import PriceFilter from './PriceFilter'

const DropFilter = ({
	basePath,
	category,
	apiEndpoint = '/category',
	userId,
}: {
	basePath: string
	category: string
	apiEndpoint?: string
	userId?: string | null
}) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false)

	return (
		<div className='xl:hidden'>
			<button
				onClick={() => setIsFilterOpen(true)}
				className='ml-3 xl:hidden w-32 h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-green-600 text-white cursor-pointer'
			>
				Фильтр
			</button>
			<div
				className={`xl:hidden flex flex-col gap-y-10 fixed top-0 left-0 bg-card h-screen w-full max-w-90 z-50 p-4 overflow-y-auto shadow-(--shadow-article) transform origin-left transition-all duration-300 ease-in-out ${isFilterOpen ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}`}
			>
				<div className='flex justify-between items-center mb-4 h-11 rounded text-base font-bold p-2'>
					<h3 className='flex justify-start items-center'>Фильтр</h3>
					<button
						onClick={() => setIsFilterOpen(false)}
						className='text-2xl cursor-pointer'
					>
						<X size={24} />
					</button>
				</div>
				<FilterButtons basePath={basePath} />
				<FilterControls basePath={basePath} />
				<PriceFilter
					basePath={basePath}
					category={category}
					setIsFilterOpenAction={setIsFilterOpen}
					userId={userId}
					apiEndpoint={apiEndpoint}
				/>
			</div>
		</div>
	)
}

export default DropFilter
