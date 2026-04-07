'use client'

import InStockToggle from '@/app/(root)/(catalog)/catalog/[category]/_components/InStockToggle'
import PriceFilterHeader from '@/app/(root)/(catalog)/catalog/[category]/_components/PriceFilterHeader'
import PriceInputs from '@/app/(root)/(catalog)/catalog/[category]/_components/PriceInputs'
import PriceRangeFilter from '@/app/(root)/(catalog)/catalog/[category]/_components/PriceRangeSlider'
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
import { CONFIG } from '../../../../../../../config/config'

type PriceRange = {
	min: number
	max: number
}

function PriceFilterContent({
	basePath,
	category,
	setIsFilterOpenAction,
}: {
	basePath: string
	category: string
	setIsFilterOpenAction?: (value: boolean) => void
}) {
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<{
		error: Error
		userMessage: string
	} | null>(null)
	const router = useRouter()
	const searchParams = useSearchParams()
	const urlPriceFrom = searchParams.get('priceFrom') || ''
	const urlPriceTo = searchParams.get('priceTo') || ''
	const urlInStock = searchParams.get('inStock') === 'true'

	const [inputValues, setInputValues] = useState({
		from: urlPriceFrom,
		to: urlPriceTo,
	})

	const [inStock, setInStock] = useState(urlInStock)
	const [priceRange, setPriceRange] = useState<PriceRange>(
		CONFIG.FALLBACK_PRICE_RANGE,
	)

	const fetchPriceData = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const currentCategory = category || searchParams.get('category')
			if (!currentCategory) return

			const params = new URLSearchParams()

			params.set('category', currentCategory)
			params.set('getPriceRangeOnly', 'true')

			const response = await fetch(`/api/category?${params.toString()}`)

			if (!response.ok)
				throw new Error(`Ошибка сервера: ${response.status}`)

			const data = await response.json()
			const receivedRange = data.priceRange || CONFIG.FALLBACK_PRICE_RANGE

			const roundedRange = {
				min: Math.floor(Number(receivedRange.min)),
				max: Math.ceil(Number(receivedRange.max)),
			}

			setPriceRange(roundedRange)

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
	}, [category, searchParams, urlPriceFrom, urlPriceTo])

	useEffect(() => {
		fetchPriceData()
	}, [fetchPriceData])

	const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault()
		applyPriceFilter()
		if (setIsFilterOpenAction) setIsFilterOpenAction(false)
	}

	const applyPriceFilter = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString())

		let fromValue = Math.max(
			priceRange.min,
			parseInt(inputValues.from) || priceRange.min,
		)
		let toValue = Math.min(
			priceRange.max,
			parseInt(inputValues.to) || priceRange.max,
		)

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

	const sliderValues = [
		parseInt(inputValues.from) || priceRange.min,
		parseInt(inputValues.to) || priceRange.max,
	]

	const handleSliderChange = useCallback((values: [number, number]) => {
		setInputValues({
			from: values[0].toString(),
			to: values[1].toString(),
		})
	}, [])

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

	if (isLoading) return <Loader />

	if (error)
		return (
			<ErrorComponent
				error={error.error}
				userMessage={error.userMessage}
			/>
		)

	return (
		<form onSubmit={handleSubmit} className='flex flex-col gap-y-10'>
			<PriceFilterHeader resetPriceFitlter={resetPriceFitlter} />
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
			<PriceRangeFilter
				min={priceRange.min}
				max={priceRange.max}
				values={sliderValues}
				handleSliderChange={handleSliderChange}
			/>
			<InStockToggle checked={inStock} handleInStockChange={setInStock} />
			<button
				type='submit'
				className='bg-[#ff6633] text-white hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) h-10 rounded justify-center items-center duration-300 cursor-pointer'
			>
				Применить
			</button>
		</form>
	)
}

const PriceFilter = ({
	basePath,
	category,
	setIsFilterOpenAction,
}: {
	basePath: string
	category: string
	setIsFilterOpenAction?: (value: boolean) => void
}) => {
	return (
		<Suspense fallback={<Loader />}>
			<PriceFilterContent
				basePath={basePath}
				category={category}
				setIsFilterOpenAction={setIsFilterOpenAction}
			/>
		</Suspense>
	)
}

export default PriceFilter
