'use client'

import {
	getOrderCartAction,
	getUserBonusesAction,
	removeMultipleOrderItemsAction,
	updateOrderItemQuantityAction,
} from '@/actions/orderActions'
import CartControls from '@/app/(root)/(cart)/cart/_components/CartControls'
import CartHeader from '@/app/(root)/(cart)/cart/_components/CartHeader'
import CartItem from '@/app/(root)/(cart)/cart/_components/CartItem'
import CardSideBar from '@/app/(root)/(cart)/cart/_components/CartSideBar'
import { Loader } from '@/components/features/common/loader'
import { usePricing } from '@/hooks/usePricing'
import { useCartStore } from '@/store/cartStore'
import { ProductCardProps } from '@/types/product'
import { useCallback, useEffect, useState } from 'react'

const CartPage = () => {
	const [selectedItems, setSelectedItems] = useState<string[]>([])
	const [productsData, setProductsData] = useState<{
		[key: string]: ProductCardProps
	}>({})
	const [bonusesCount, setBonusesCount] = useState<number>(0)
	const [hasLoyaltyCard, setHasLoyaltyCard] = useState<boolean>(false)
	const [removedItems, setRemovedItems] = useState<string[]>([])
	const [isCartLoading, setIsCartLoading] = useState(true)
	const [useBonuses, setUseBonuses] = useState<boolean>(false)
	const { cartItems, updateCart } = useCartStore()
	const visibleCartItems = cartItems.filter(
		item => !removedItems.includes(item.productId),
	)
	const availableCartItems = visibleCartItems.filter(item => {
		const product = productsData[item.productId]
		return product && product.quantity > 0
	})

	const {
		totalPrice,
		totalMaxPrice,
		totalDiscount,
		finalPrice,
		totalBonuses,
		isMinimumReached,
	} = usePricing({
		availableCartItems,
		productsData,
		hasLoyaltyCard,
		bonusesCount,
		useBonuses,
	})

	const commonSidebarProps = {
		bonusesCount,
		useBonuses,
		onUseBonusesChange: setUseBonuses,
		totalPrice,
		visibleCartItems,
		totalMaxPrice,
		totalDiscount,
		finalPrice,
		totalBonuses,
		isMinimumReached,
	}

	// Асинхронная функция загрузки данных корзины и товаров
	const fetchCartAndProducts = async () => {
		setIsCartLoading(true)

		try {
			const userData = await getUserBonusesAction()
			setBonusesCount(userData.bonusesCount)
			setHasLoyaltyCard(userData.hasLoyaltyCard)

			const cartItems = await getOrderCartAction()

			updateCart(cartItems)

			const productPromises = cartItems.map(async item => {
				try {
					const response = await fetch(
						`/api/products/${item.productId}`,
					)
					const product = await response.json()
					return { productId: item.productId, product }
				} catch (error) {
					console.error(
						`Ошибка получения продукта ${item.productId}:`,
						error,
					)
					return null
				}
			})

			const productsResults = await Promise.all(productPromises)
			const productsMap: { [key: string]: ProductCardProps } = {}

			productsResults.forEach(result => {
				if (result && result.product) {
					productsMap[result.productId] = result.product
				}
			})

			setProductsData(productsMap)
		} catch (error) {
			console.error('Ошибка получения данных корзины:', error)
		} finally {
			setIsCartLoading(false)
		}
	}

	useEffect(() => {
		fetchCartAndProducts()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Функция обновления количества товара
	const handleQuantityUpdate = useCallback(
		async (productId: string, newQuantity: number) => {
			const updatedCartItems = cartItems.map(item =>
				item.productId === productId
					? { ...item, quantity: newQuantity }
					: item,
			)
			updateCart(updatedCartItems)

			try {
				await updateOrderItemQuantityAction(productId, newQuantity)
			} catch (error) {
				console.error('Ошибка обновления количества:', error)
				updateCart(cartItems)
			}
		},
		[cartItems, updateCart],
	)

	// Функция удаления выбранных товаров
	const handleRemoveSelected = async () => {
		if (selectedItems.length === 0) return

		setRemovedItems(prev => [...prev, ...selectedItems])

		const updatedCartItems = cartItems.filter(
			item => !selectedItems.includes(item.productId),
		)
		updateCart(updatedCartItems)

		try {
			removeMultipleOrderItemsAction(selectedItems)
			setSelectedItems([])
		} catch (error) {
			console.error('Ошибка удаления товаров:', error)
			setRemovedItems(prev =>
				prev.filter(id => !selectedItems.includes(id)),
			)
			updateCart(cartItems)
		}
	}

	// Выделить все товары в корзине
	const selectAllItems = () => {
		setSelectedItems(visibleCartItems.map(item => item.productId))
	}

	// Снять выделение со всех товаров
	const deselectAllItems = () => {
		setSelectedItems([])
	}

	// Обработчик выбора/снятия выбора отдельного товара
	const handleItemSelection = useCallback(
		(productId: string, isSelected: boolean) => {
			if (isSelected) {
				setSelectedItems(prev => [...prev, productId])
			} else {
				setSelectedItems(prev => prev.filter(id => id !== productId))
			}
		},
		[],
	)

	// Проверка, выбраны ли все товары в корзине
	const isAllSelected =
		selectedItems.length > 0 &&
		selectedItems.length === visibleCartItems.length

	if (isCartLoading) {
		return <Loader />
	}

	if (visibleCartItems.length === 0 && removedItems.length === 0) {
		return (
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-2xl font-bold mb-8'>Корзина</h1>
				<div className='text-center py-12'>
					<p className='text-[#aaaaaa] text-lg'>Корзина пуста</p>
				</div>
			</div>
		)
	}

	return (
		<div className='px-[max(12px,calc((100%-1208px)/2))] md:px-[max(16px,calc((100%-1208px)/2))] mx-auto'>
			<CartHeader itemCount={visibleCartItems.length} />

			<CartControls
				isAllSelected={isAllSelected}
				selectedItemsCount={selectedItems.length}
				onSelectAll={selectAllItems}
				onDeselectAll={deselectAllItems}
				onRemoveSelected={handleRemoveSelected}
			/>

			<div className='flex flex-col md:flex-row gap-8 xl:gap-x-15 w-full'>
				<div className='flex flex-col gap-y-6 w-full'>
					{visibleCartItems.map(item => (
						<CartItem
							key={item.productId}
							item={item}
							productData={productsData[item.productId]}
							isSelected={selectedItems.includes(item.productId)}
							onSelectionChange={handleItemSelection}
							onQuantityUpdate={handleQuantityUpdate}
							hasLoyaltyCard={hasLoyaltyCard}
						/>
					))}
				</div>

				<CardSideBar {...commonSidebarProps} />
			</div>
		</div>
	)
}

export default CartPage
