import InStockToggle from '@/components/shared/InStockToggle'
import { useCartStore } from '@/store/cartStore'
import { CONFIG } from '../../../../../../config/config'

/**
 * Компонент секции управления бонусами в корзине
 * 
 * Функционал:
 * - Отображает количество доступных бонусов на карте
 * - Позволяет списать бонусы для оплаты (до 10% от суммы заказа)
 * - Переключатель активации/деактивации использования бонусов
 * 
 * Логика:
 * - Максимум можно списать: min(доступные бонусы, 10% от суммы заказа)
 * - Если бонусов нет (maxBonusUse <= 0) - компонент не отображается
 * - После оформления заказа (isOrdered) переключатель блокируется
 * 
 * Используется в:
 * - CartSideBar - боковая панель корзины
 */
const BonusesSection = () => {
	const { setUseBonuses, useBonuses, pricing, isOrdered } = useCartStore()
	const { totalPrice, maxBonusUse } = pricing

	if (maxBonusUse <= 0) return null

	return (
		<div className='flex flex-col gap-y-5 text-base pb-6 border-b-2 border-[#f3f2f1]'>
			<div className='flex flex-row items-center gap-x-2'>
				<InStockToggle
					checked={useBonuses}
					handleInStockChange={isOrdered ? () => {} : setUseBonuses}
				/>
				<p>
					Списать{' '}
					{Math.min(
						maxBonusUse,
						Math.floor(
							(totalPrice * CONFIG.MAX_BONUSES_PERCENT) / 100,
						),
					)}{' '}
					₽
				</p>
			</div>
			<div className='text-[#bfbfbf]'>
				{`На карте накоплено ${maxBonusUse} ₽ `}
			</div>
		</div>
	)
}

export default BonusesSection
