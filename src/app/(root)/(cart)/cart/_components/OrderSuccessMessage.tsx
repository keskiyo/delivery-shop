import { useCartStore } from '@/store/cartStore'
import { CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CONFIG } from '../../../../../../config/config'
import { getWordEnding } from '../../../../../../utils/getWordEnding'

const OrderSuccessMessage = ({
	orderNumber,
}: {
	orderNumber: string | null
}) => {
	const { pricing, useBonuses, resetAfterOrder } = useCartStore()
	const { totalBonuses, maxBonusUse, totalPrice } = pricing
	const router = useRouter()

	const handleToOrder = () => {
		resetAfterOrder()
		router.push('/user-orders')
	}

	const usedBonuses = Math.min(
		maxBonusUse,
		Math.floor((totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100),
	)

	return (
		<div className='text-center p-4 bg-[#e5ffde] text-[#008c49] rounded border border-green-600'>
			<div className='font-bold text-lg mb-2'>
				Заказ оформлен успешно!
			</div>
			<div className='mb-3'>
				Номер вашего заказа: <strong>{orderNumber}</strong>
			</div>
			<div className='text-sm mb-3'>
				Вы можете оплатить заказ при получении курьеру наличными или
				картой. С Вами свяжутся для подтверждения времени доставки.
			</div>
			{useBonuses && (
				<div className='text-sm mb-3 text-green-600 flex items-center justify-center gap-2'>
					<CreditCard size={16} className='shrink-0' />
					{usedBonuses} бонус
					{getWordEnding(usedBonuses)} будет списано после
					подтверждения оплаты
				</div>
			)}
			<div className='text-sm mb-3 text-green-600 flex items-center justify-center gap-2'>
				<CreditCard size={16} className='shrink-0' />
				После доставки вам будет начислено {totalBonuses} бонус
				{getWordEnding(totalBonuses)}
			</div>
			<button
				onClick={handleToOrder}
				className='ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white cursor-pointer duration-300'
			>
				Перейти на страницу заказов
			</button>
		</div>
	)
}

export default OrderSuccessMessage
