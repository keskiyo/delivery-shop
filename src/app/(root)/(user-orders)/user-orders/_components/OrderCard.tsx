import ProductsSections from '@/app/(root)/(products)/ProductsSections'
import DeliveryDatePicker from '@/app/(root)/(user-orders)/user-orders/_components/DeliveryDatePicker'
import { OrderActions } from '@/app/(root)/(user-orders)/user-orders/_components/OrderActions'
import OrderDetails from '@/app/(root)/(user-orders)/user-orders/_components/OrderDetails'
import OrderHeader from '@/app/(root)/(user-orders)/user-orders/_components/OrderHeader'
import RepeatOrderSection from '@/app/(root)/(user-orders)/user-orders/_components/RepeatOrderSection'
import { RepeatOrderSuccessAlert } from '@/app/(root)/(user-orders)/user-orders/_components/RepeatOrderSuccessAlert'
import { StockWarningsAlert } from '@/app/(root)/(user-orders)/user-orders/_components/StockWarningsAlert'
import { Loader } from '@/components/features/common/loader'
import { useDeliveryData } from '@/hooks/useDeliveryData'
import { useOrderProductsData } from '@/hooks/useOrderProductsData'
import { usePriceComparison } from '@/hooks/usePriceComparison'
import useRepeatOrder from '@/hooks/useRepeatOrder'
import { useOrderPricing } from '@/hooks/userOrderPricing'
import { useOrderProducts } from '@/hooks/userOrderProducts'
import { Order } from '@/types/order'
import { ProductsData } from '@/types/userOrder'
import { useEffect, useState } from 'react'

const OrderCard = ({ order }: { order: Order }) => {
	const [showOrderDetails, setShowOrderDetails] = useState(false)
	const [showPriceWarning, setShowPriceWarning] = useState(false)

	const { productsData: fetchedProductsData, loading: productsDataLoading } =
		useOrderProductsData(order)

	const { orderProducts, stockWarnings } = useOrderProducts(
		order,
		fetchedProductsData,
	)

	const { currentProducts, priceComparison } = usePriceComparison(
		order,
		fetchedProductsData,
	)

	const { cartItemsForSummary, productsData, customPricing } =
		useOrderPricing(order, currentProducts)

	const {
		showDatePicker,
		showDeliveryButton,
		handleOrderClick,
		handleDeliveryClick,
		handleDateSelect,
		handleCancelDelivery,
		isRepeatOrderCreated,
		handleRepeatOrderSuccess,
		handleEditDelivery,
		selectedDelivery,
	} = useRepeatOrder()

	const { deliverySchedule } = useDeliveryData()

	const hasStockIssues = orderProducts.some(
		product => product.isLowStock || product.insufficientStock,
	)
	const canCreateRepeatOrder = !hasStockIssues
	const applyIndexStyles = !showOrderDetails

	useEffect(() => {
		if (priceComparison?.hasChanges) {
			setShowPriceWarning(true)
		}
	}, [priceComparison])

	if (productsDataLoading) {
		return <Loader />
	}

	return (
		<div>
			<OrderHeader
				order={order}
				showDeliveryButton={showDeliveryButton}
				onOrderClick={handleOrderClick}
				onDeliveryClick={handleDeliveryClick}
				disabled={hasStockIssues}
			/>
			<ProductsSections
				products={orderProducts}
				applyIndexStyles={applyIndexStyles}
				isOrderPage={true}
			/>
			<RepeatOrderSection
				isRepeatOrderCreated={isRepeatOrderCreated}
				selectedDelivery={selectedDelivery}
				canCreateRepeatOrder={canCreateRepeatOrder}
				order={order}
				priceComparison={priceComparison}
				showPriceWarning={showPriceWarning}
				onClosePriceWarning={() => setShowPriceWarning(false)}
				deliveryData={selectedDelivery}
				onEditDelivery={handleEditDelivery}
				productsData={productsData as unknown as ProductsData}
				cartItemsForSummary={cartItemsForSummary}
				customPricing={customPricing}
				onOrderSuccess={handleRepeatOrderSuccess}
			/>
			<StockWarningsAlert
				warnings={stockWarnings}
				hasStockIssues={hasStockIssues}
			/>
			{isRepeatOrderCreated && <RepeatOrderSuccessAlert />}
			<OrderActions
				showOrderDetails={showOrderDetails}
				onToggleDetails={() => setShowOrderDetails(!showOrderDetails)}
			/>
			{showOrderDetails && <OrderDetails order={order} />}
			{showDatePicker && (
				<DeliveryDatePicker
					schedule={deliverySchedule}
					isCreatingOrder={false}
					onDateSelect={(date, timeSlot) =>
						handleDateSelect(date, timeSlot, order.deliveryAddress)
					}
					onCancel={handleCancelDelivery}
				/>
			)}
		</div>
	)
}

export default OrderCard
