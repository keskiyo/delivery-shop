import { PaymentSuccessData } from '@/types/payment'
import { Check } from 'lucide-react'
import { formatPrice } from '../../../../utils/formatPrice'

interface PaymentSuccessModalProps {
	isOpen: boolean
	onClose: () => void
	successData: PaymentSuccessData | null
}

const PaymentSuccessModal = ({
	isOpen,
	onClose,
	successData,
}: PaymentSuccessModalProps) => {
	if (!isOpen || !successData) return null

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-muted/80 backdrop-blur-sm'>
			<div className='w-full max-w-md p-6 text-center rounded-lg bg-card'>
				<div className='flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-success-soft'>
					<Check
						className='w-8 h-8 text-success shrink-0 '
						strokeWidth={4}
					/>
				</div>

				<h2 className='mb-2 text-2xl font-bold'>
					Оплата прошла успешно!
				</h2>

				<div className='p-4 mb-6 space-y-3 text-left rounded-lg bg-surface'>
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>
							Номер заказа:
						</span>
						<span className='font-semibold'>
							{successData.orderNumber}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>
							ID платежа:
						</span>
						<span className='font-mono text-sm'>
							{successData.paymentId}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>Сумма:</span>
						<span className='font-semibold'>
							{formatPrice(successData.amount)} ₽
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>Карта:</span>
						<span className='font-mono'>
							**** {successData.cardLast4}
						</span>
					</div>
				</div>

				<p className='mb-6 text-muted-foreground'>
					Ваш заказ успешно оплачен и передан в обработку. В ближайшее
					время с Вами свяжется наш менеджер для подтверждения
					доставки.
				</p>

				<button
					onClick={onClose}
					className='w-full px-4 py-3 font-medium text-white transition-colors rounded-lg cursor-pointer bg-brand hover:bg-brand-hover'
				>
					Понятно
				</button>
			</div>
		</div>
	)
}

export default PaymentSuccessModal
