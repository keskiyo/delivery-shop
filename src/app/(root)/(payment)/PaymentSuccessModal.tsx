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
		<div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
			<div className='bg-card rounded-lg max-w-md w-full p-6 text-center'>
				<div className='w-16 h-16 bg-success-soft rounded-full flex items-center justify-center mx-auto mb-4'>
					<Check
						className='w-8 h-8 text-success shrink-0 '
						strokeWidth={4}
					/>
				</div>

				<h2 className='text-2xl font-bold mb-2'>
					Оплата прошла успешно!
				</h2>

				<div className='space-y-3 mb-6 text-left bg-surface p-4 rounded-lg'>
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>Номер заказа:</span>
						<span className='font-semibold'>
							{successData.orderNumber}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-muted-foreground'>ID платежа:</span>
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

				<p className='text-muted-foreground mb-6'>
					Ваш заказ успешно оплачен и передан в обработку. В ближайшее
					время с Вами свяжется наш менеджер для подтверждения
					доставки.
				</p>

				<button
					onClick={onClose}
					className='w-full py-3 px-4 bg-brand text-brand-foreground rounded-lg hover:bg-brand-hover transition-colors font-medium cursor-pointer'
				>
					Понятно
				</button>
			</div>
		</div>
	)
}

export default PaymentSuccessModal
