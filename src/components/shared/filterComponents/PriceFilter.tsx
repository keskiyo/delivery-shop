'use client'

import ErrorComponent from '@/components/features/common/ErrorComponent'
import { Loader } from '@/components/features/common/loader'
import { useRouter, useSearchParams } from 'next/navigation'
import {
	Suspense,
	SyntheticEvent,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { CONFIG } from '../../../../config/config'
import InStockToggle from '../InStockToggle'
import PriceFilterHeader from './PriceFilterHeader'
import PriceInputs from './PriceInputs'
import PriceRangeFilter from './PriceRangeSlider'

type PriceRange = {
	min: number
	max: number
}

/**
 * Компонент фильтра товаров по цене и наличию
 * 
 * Функционал:
 * - Загружает диапазон цен для текущей категории из API
 * - Позволяет фильтровать товары по минимальной и максимальной цене
 * - Фильтр "В наличии" для показа только доступных товаров
 * - Синхронизация с URL параметрами (priceFrom, priceTo, inStock)
 * - Двусторонняя синхронизация между слайдером и инпутами
 * 
 * Логика работы:
 * 1. При монтировании загружает диапазон цен для категории
 * 2. Инициализирует значения из URL параметров (если есть)
 * 3. При изменении слайдера обновляет инпуты
 * 4. При изменении инпутов обновляет слайдер
 * 5. При применении фильтра обновляет URL и перезагружает товары
 * 6. Кнопка "Сбросить" возвращает к полному диапазону цен
 */
function PriceFilterContent(props: {
	basePath: string
	category: string
	setIsFilterOpenAction?: (value: boolean) => void
	userId?: string | null
	apiEndpoint?: string
}) {
	const {
		basePath,
		category,
		setIsFilterOpenAction,
		userId,
		apiEndpoint = '/category',
	} = props
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const router = useRouter()
	const searchParams = useSearchParams()
	
	// Получаем текущие значения фильтров из URL
	const urlPriceFrom = searchParams.get('priceFrom') || ''
	const urlPriceTo = searchParams.get('priceTo') || ''
	const urlInStock = searchParams.get('inStock') === 'true'

	// Локальное состояние для инпутов (синхронизируется со слайдером)
	const [inputValues, setInputValues] = useState({
		from: urlPriceFrom,
		to: urlPriceTo,
	})

	const [inStock, setInStock] = useState(urlInStock)
	// Диапазон цен для текущей категории (загружается с сервера)
	const [priceRange, setPriceRange] = useState<PriceRange>(
		CONFIG.FALLBACK_PRICE_RANGE,
	)

	/**
	 * Загружает диапазон цен для текущей категории
	 * 
	 * Процесс:
	 * 1. Формирует запрос с параметром getPriceRangeOnly=true
	 * 2. Получает min и max цены из API
	 * 3. Округляет значения (min вниз, max вверх)
	 * 4. Инициализирует инпуты значениями из URL или диапазоном
	 * 5. При ошибке использует fallback диапазон из конфига
	 */
	const fetchPriceData = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const currentCategory = category || searchParams.get('category')
			if (!currentCategory) return

			const params = new URLSearchParams()

			params.set('category', currentCategory)
			params.set('getPriceRangeOnly', 'true')

			if (userId) params.set('userId', userId)

			const response = await fetch(
				`/api/${apiEndpoint}?${params.toString()}`,
			)

			if (!response.ok)
				throw new Error(`Ошибка сервера: ${response.status}`)

			const data = await response.json()
			const receivedRange = data.priceRange || CONFIG.FALLBACK_PRICE_RANGE

			// Округляем диапазон для удобства (min вниз, max вверх)
			const roundedRange = {
				min: Math.floor(Number(receivedRange.min)),
				max: Math.ceil(Number(receivedRange.max)),
			}

			setPriceRange(roundedRange)

			// Инициализируем инпуты значениями из URL или диапазоном
			setInputValues({
				from: urlPriceFrom || roundedRange.min.toString(),
				to: urlPriceTo || roundedRange.max.toString(),
			})
		} catch (error) {
			setError({
				error:
					error instanceof Error
						? error
						: new Error('Неизвестная ошибка'),
				userMessage: 'Ошибка продуктов по цене',
			})
			setPriceRange(CONFIG.FALLBACK_PRICE_RANGE)
			setInputValues({
				from: CONFIG.FALLBACK_PRICE_RANGE.min.toString(),
				to: CONFIG.FALLBACK_PRICE_RANGE.max.toString(),
			})
		} finally {
			setIsLoading(false)
		}
	}, [category, searchParams, urlPriceFrom, urlPriceTo, userId, apiEndpoint])

	useEffect(() => {
		fetchPriceData()
	}, [fetchPriceData])

	/**
	 * Обработчик отправки формы
	 * Применяет фильтр и закрывает модальное окно (на мобильных)
	 */
	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()
		applyPriceFilter()
		if (setIsFilterOpenAction) setIsFilterOpenAction(false)
	}

	/**
	 * Применяет фильтр по цене и наличию
	 * 
	 * Логика:
	 * 1. Валидирует значения (не меньше min, не больше max)
	 * 2. Меняет местами, если from > to
	 * 3. Обновляет URL параметры (priceFrom, priceTo, inStock)
	 * 4. Перенаправляет на обновленный URL (триггерит перезагрузку товаров)
	 */
	const applyPriceFilter = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString())

		// Валидируем и ограничиваем значения диапазоном
		let fromValue = Math.max(
			priceRange.min,
			parseInt(inputValues.from) || priceRange.min,
		)
		let toValue = Math.min(
			priceRange.max,
			parseInt(inputValues.to) || priceRange.max,
		)

		// Меняем местами, если from > to
		if (fromValue > toValue) [fromValue, toValue] = [toValue, fromValue]

		params.set('priceFrom', fromValue.toString())
		params.set('priceTo', toValue.toString())
		params.set('inStock', inStock.toString())

		router.push(`${basePath}?${params.toString()}`)
	}, [
		searchParams,
		priceRange.min,
		priceRange.max,
		inputValues.from,
		inputValues.to,
		inStock,
		router,
		basePath,
	])

	// Значения для слайдера (синхронизированы с инпутами)
	const sliderValues = [
		parseInt(inputValues.from) || priceRange.min,
		parseInt(inputValues.to) || priceRange.max,
	]

	/**
	 * Обработчик изменения слайдера
	 * Обновляет значения инпутов при перемещении ползунков
	 */
	const handleSliderChange = useCallback((values: [number, number]) => {
		setInputValues({
			from: values[0].toString(),
			to: values[1].toString(),
		})
	}, [])

	/**
	 * Сбрасывает фильтр по цене
	 * 
	 * Действия:
	 * 1. Возвращает инпуты к полному диапазону цен
	 * 2. Удаляет параметры priceFrom, priceTo из URL
	 * 3. Сбрасывает пагинацию (удаляет page)
	 */
	const resetPriceFitlter = useCallback(() => {
		setInputValues({
			from: priceRange.min.toString(),
			to: priceRange.max.toString(),
		})

		const params = new URLSearchParams(searchParams.toString())
		params.delete('priceFrom')
		params.delete('priceTo')
		params.delete('page')

		router.push(`${basePath}?${params.toString()}`)
	}, [basePath, priceRange.max, priceRange.min, router, searchParams])

	if (isLoading || isNaN(priceRange.min) || isNaN(priceRange.max))
		return <Loader />

	if (error)
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-y-10'>
			{/* Заголовок с кнопкой "Сбросить" */}
			<PriceFilterHeader resetPriceFitlter={resetPriceFitlter} />
			
			{/* Инпуты для ввода цены от и до */}
			<PriceInputs
				onFromChangeAction={(value: string) =>
					setInputValues(prev => ({ ...prev, from: value }))
				}
				onToChangeAction={(value: string) =>
					setInputValues(prev => ({ ...prev, to: value }))
				}
				from={inputValues.from}
				to={inputValues.to}
				min={priceRange.min}
				max={priceRange.max}
			/>
			
			{/* Слайдер для выбора диапазона цен */}
			<PriceRangeFilter
				min={priceRange.min}
				max={priceRange.max}
				values={sliderValues}
				handleSliderChange={handleSliderChange}
			/>
			
			{/* Чекбокс "В наличии" */}
			<InStockToggle
				checked={inStock}
				handleInStockChange={setInStock}
				labelText='В наличии'
			/>
			
			{/* Кнопка применения фильтра */}
			<button
				type='submit'
				className='bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center duration-300 cursor-pointer'
			>
				Применить
			</button>
		</form>
	)
}

/**
 * Обертка компонента с Suspense для обработки асинхронной загрузки
 */
const PriceFilter = (props: {
	basePath: string
	category: string
	setIsFilterOpenAction?: (value: boolean) => void
	userId?: string | null
	apiEndpoint?: string
}) => {
	return (
		<Suspense fallback={<Loader />}>
			<PriceFilterContent {...props} />
		</Suspense>
	)
}

export default PriceFilter
