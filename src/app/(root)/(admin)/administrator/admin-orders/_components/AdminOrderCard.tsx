import CalendarOrderModal from '@/app/(root)/(admin)/administrator/admin-orders/_components/CalendarOrderModal'
import OrderChatModal from '@/app/(root)/(admin)/administrator/admin-orders/_components/OrderChatModal'
import OrderDetails from '@/app/(root)/(admin)/administrator/admin-orders/_components/OrderDetails'
import OrderProductsLoader from '@/app/(root)/(admin)/administrator/admin-orders/_components/OrderProductsLoader'
import { exportOrderToExcel } from '@/app/(root)/(admin)/administrator/admin-orders/utils/exportOrderToExcel'
import { buttonStyles } from '@/app/(root)/(auth)/styles'
import { updateOrderStatus } from '@/app/(root)/(cart)/cart/utils/orderHelpers'
import IconNotice from '@/components/svg/IconNotice'
import IconVision from '@/components/svg/IconVision'
import {
	useGetOrderMessagesQuery,
	useUnreadMessagesQuery,
} from '@/store/redux/api/chatApi'
import { useGetAdminOrdersQuery } from '@/store/redux/api/ordersApi'
import {
	CalendarDays,
	Download,
	MessageSquare,
	MessageSquareText,
	Phone,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatPhoneNumber } from '../utils/formatPhoneNumber'
import { getEnglishStatuses } from '../utils/getEnglishStatuses'
import { getMappedStatus } from '../utils/getMappedStatus'
import StatusDropdown from './StatusDropdown'
import UserAvatar from './UserAvatar'

interface AdminOrderCardProps {
	orderId: string
}

const AdminOrderCard = ({ orderId }: AdminOrderCardProps) => {
	const { data } = useGetAdminOrdersQuery()
	const order = data?.orders?.find(o => o._id === orderId)
	const [showCalendar, setShowCalendar] = useState(false)

	const [currentStatusLabel, setCurrentStatusLabel] = useState<string>(
		order ? getMappedStatus(order) : '',
	)
	const [isUpdating, setIsUpdating] = useState(false)
	const [showOrderDetails, setShowOrderDetails] = useState(false)
	const [showChat, setShowChat] = useState(false)
	const { data: messages = [] } = useGetOrderMessagesQuery(orderId)

	const { data: unread = false } = useUnreadMessagesQuery(orderId, {
		pollingInterval: 10000,
	})

	const [isExporting, setIsExporting] = useState(false)
	const [showFullOrder, setShowFullOrder] = useState(false)
	const [totalOrderWeight, setTotalOrderWeight] = useState(0)

	const showCalendarIcon =
		order && (order.status === 'confirmed' || order.status === 'pending')

	const formattedPhone = order ? formatPhoneNumber(order.phone) : ''

	useEffect(() => {
		if (order) {
			setCurrentStatusLabel(getMappedStatus(order))
		}
	}, [order])

	const handleOpenCalendar = () => {
		if (showCalendarIcon) {
			setShowCalendar(true)
		}
	}

	const handleStatusChange = async (newStatusLabel: string) => {
		if (!order) return

		setIsUpdating(true)
		try {
			const { status: englishStatus, paymentStatus } = getEnglishStatuses(
				newStatusLabel,
				order,
			)

			const updateData: { status: string; paymentStatus?: string } = {
				status: englishStatus,
			}

			if (paymentStatus !== undefined) {
				updateData.paymentStatus = paymentStatus
			}

			await updateOrderStatus(order._id, updateData)
			setCurrentStatusLabel(newStatusLabel)
		} catch (error) {
			console.error('Ошибка при обновлении статуса:', error)
		} finally {
			setIsUpdating(false)
		}
	}

	const handleToggleDetails = () => {
		if (!showOrderDetails) {
			setShowOrderDetails(true)
			setShowFullOrder(false)
		} else {
			setShowOrderDetails(false)
			setShowFullOrder(false)
		}
	}

	const handleToggleFullOrder = () => {
		if (showFullOrder) {
			setShowOrderDetails(false)
			setShowFullOrder(false)
		} else {
			setShowFullOrder(true)
		}
	}

	const handleTotalWeightCalculated = (weight: number) => {
		setTotalOrderWeight(weight)
	}

	const handleOpenChat = () => {
		fetch(`/api/admin/chat/${orderId}/read`, {
			method: 'POST',
		})
		setShowChat(true)
	}

	const handleCloseChat = () => {
		setShowChat(false)
	}

	const handleCloseCalendar = () => {
		if (showCalendarIcon) {
			setShowCalendar(false)
		}
	}

	const handleExportToExcel = async () => {
		if (!order || isExporting) return

		setIsExporting(true)
		try {
			await exportOrderToExcel(order)
		} catch (error) {
			console.error('Ошибка при выгрузке в Excel:', error)
		} finally {
			setIsExporting(false)
		}
	}

	if (!order) return null

	return (
		<div className='flex flex-col'>
			<div className='flex flex-1 flex-wrap justify-between items-start gap-x-20'>
				<div className='flex gap-x-4 items-center'>
					<h2 className='text-base md:text-lg xl:text-2xl font-bold'>
						{order.orderNumber.slice(-3)}
					</h2>
					<div className='flex items-center gap-x-2'>
						<UserAvatar
							userId={order.userId}
							gender={order.gender}
							name={order.name}
						/>
						<span className='text-base md:text-lg'>
							{order.name}
						</span>
					</div>
				</div>
				<div className='flex flex-wrap gap-5 items-center'>
					{/* Телефон */}
					<div className='flex items-center gap-2'>
						<Phone className='w-6 h-6' />
						<span className='underline'>{formattedPhone}</span>
					</div>
					<StatusDropdown
						currentStatusLabel={currentStatusLabel}
						isUpdating={isUpdating}
						onStatusChange={handleStatusChange}
					/>
					{!showOrderDetails && (
						<button
							className='bg-[#f3f2f1] hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer text-gray-800'
							onClick={handleToggleDetails}
						>
							<IconVision showPassword={!showOrderDetails} />
							Посмотреть
						</button>
					)}

					{showOrderDetails && (
						<button
							className={`${buttonStyles.active} hover:shadow-button-secondary w-50 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer`}
							onClick={handleExportToExcel}
						>
							<Download className='w-6 h-6' />
							Скачать в Excel
						</button>
					)}

					{/* Кнопка чата или календаря */}
					{showCalendarIcon ? (
						<div>
							// При confirmed/pending
							<button
								className='relative bg-[#f3f2f1] hover:shadow-button-secondary w-10 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer text-gray-800'
								onClick={handleOpenCalendar}
							>
								<CalendarDays className='w-6 h-6' />
							</button>
							<CalendarOrderModal
								orderId={orderId}
								isOpen={showCalendar}
								onClose={handleCloseCalendar}
							/>
						</div>
					) : (
						// Показываем иконку чата для остальных статусов
						<button
							className='relative bg-[#f3f2f1] hover:shadow-button-secondary w-10 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer text-gray-800'
							onClick={handleOpenChat}
						>
							{messages.length === 0 ? (
								<MessageSquare className='w-6 h-6' />
							) : (
								<MessageSquareText className='w-6 h-6' />
							)}
							{unread && <IconNotice />}
						</button>
					)}
				</div>
			</div>
			{/* Товары показываем когда showOrderDetails = true */}
			{showOrderDetails && (
				<>
					<OrderProductsLoader
						orderItems={order.items}
						onTotalWeightCalculated={handleTotalWeightCalculated}
						applyIndexStyles={!showFullOrder}
						showFullOrder={showFullOrder}
					/>

					{/* Полные детали заказа показываем когда showFullOrder = true */}
					{showFullOrder && (
						<OrderDetails
							order={order}
							totalWeight={totalOrderWeight}
						/>
					)}
				</>
			)}

			{/* Нижняя кнопка Показать заказ/Скрыть */}
			{showOrderDetails && !showFullOrder && (
				<div className='flex justify-center mt-10'>
					<button
						className='bg-[#f3f2f1] hover:shadow-button-secondary w-60 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer text-gray-800'
						onClick={handleToggleFullOrder}
					>
						<IconVision showPassword={true} />
						Показать заказ
					</button>
				</div>
			)}
			{showFullOrder && (
				<div className='flex justify-center mt-10'>
					<button
						className='bg-[#f3f2f1] hover:shadow-button-secondary w-60 h-10 px-2 flex justify-center items-center gap-2 rounded duration-300 cursor-pointer text-gray-800'
						onClick={handleToggleFullOrder}
					>
						<IconVision showPassword={false} />
						Скрыть
					</button>
				</div>
			)}
			<OrderChatModal
				orderId={orderId}
				isOpen={showChat}
				onClose={handleCloseChat}
				orderNumber={order.orderNumber}
			/>
		</div>
	)
}

export default AdminOrderCard
