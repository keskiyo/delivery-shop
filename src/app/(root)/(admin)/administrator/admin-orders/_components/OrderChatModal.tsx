import { useEffect, useRef, useState } from 'react'

import { getRoleDisplayName } from '@/app/(root)/(admin)/administrator/admin-orders/utils/getRoleDisplayName'
import { useAuthStore } from '@/store/authStore'
import { useGetOrderMessagesQuery } from '@/store/redux/api/chatApi'
import { ChatMessage, OrderChatModalProps } from '@/types/chat'
import { X } from 'lucide-react'

const OrderChatModal = ({
	orderNumber,
	orderId,
	isOpen,
	onClose,
}: OrderChatModalProps) => {
	const [message, setMessage] = useState('')
	const [isSending, setIsSending] = useState(false)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const { user } = useAuthStore()

	// Получаем сообщения через RTK Query с polling
	const { data: messages = [] } = useGetOrderMessagesQuery(orderId, {
		skip: !isOpen || !orderId,
		pollingInterval: isOpen ? 3000 : 0,
	})

	const getMessageRole = (msg: ChatMessage) => {
		return msg.userRole || 'courier'
	}

	// Автопрокрутка к новым сообщениям
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// Отправка сообщения через fetch
	const handleSendMessage = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		if (!message.trim() || isSending) return

		setIsSending(true)

		try {
			const response = await fetch('/api/admin/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orderId,
					message: message.trim(),
					userName: user?.name,
					userRole: user?.role,
				}),
			})

			if (!response.ok) {
				throw new Error(`Ошибка ${response.status}`)
			}

			setMessage('')
		} catch (error) {
			console.error('Ошибка отправки сообщения:', error)
		} finally {
			setIsSending(false)
		}
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 min-h-screen py-10 px-3'>
			<div className='max-w-150 w-full relative bg-[#686868] rounded shadow-auth-form max-h-[calc(100vh-80px)] flex flex-col px-25 pb-15'>
				<button
					onClick={onClose}
					className='bg-[#f3f2f1] rounded w-8 h-8 mb-8 absolute top-0 right-0 flex justify-center items-center duration-300 cursor-pointer m-2'
				>
					<X size={24} className='text-gray-600' />
				</button>
				<h3 className='text-center text-2xl font-bold px-4 mt-18 mb-8 text-white'>
					Комментарии к заказу № {orderNumber.slice(-3)}
				</h3>

				<div className='flex-1 overflow-y-auto space-y-4 w-full mx-auto px-2'>
					{messages.map(msg => {
						const role = getMessageRole(msg)
						const roleDisplayName = getRoleDisplayName(role)
						const isCurrentUser = user?.id === msg.userId

						// Стили пузыря в зависимости от отправителя
						const bubbleBase =
							'relative max-w-[85%] md:max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm transition-all hover:shadow-md'

						const bubbleClass = isCurrentUser
							? 'bg-[#766ac8] text-white rounded-br-md' // свои: фиолетово-голубые, справа
							: 'bg-[#363636] text-white rounded-bl-md' // чужие: темно-серые, слева

						return (
							<div
								key={msg._id}
								className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'} mb-4`}
							>
								{/* Мета информация (имя, роль, время, дата)*/}
								<div
									className={`flex items-center mb-1.5 text-xs gap-1 ${
										isCurrentUser ? '' : ''
									}`}
								>
									<span
										className={`font-medium ${isCurrentUser ? 'text-white/90' : 'text-[#bfbfbf]'}`}
									>
										{msg.userName}
									</span>
									<span
										className={`font-medium ${isCurrentUser ? 'text-white/90' : 'text-[#bfbfbf]'}`}
									>
										{roleDisplayName}
									</span>
									<span
										className={
											isCurrentUser
												? 'text-white/90'
												: 'text-[#bfbfbf]'
										}
									>
										{new Date(
											msg.timestamp,
										).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
										})}{' '}
										{new Date(
											msg.timestamp,
										).toLocaleDateString('ru-RU', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
										})}
									</span>
								</div>

								{/* Пузырь сообщения */}
								<div className={`${bubbleBase} ${bubbleClass}`}>
									{/* Текст сообщения */}
									<p className='text-sm leading-relaxed whitespace-pre-wrap wrap-break-word relative z-10'>
										{msg.message}
									</p>
								</div>
							</div>
						)
					})}
					<div ref={messagesEndRef} />
				</div>

				<form onSubmit={handleSendMessage} className='w-full mx-auto'>
					<div className='flex flex-col gap-8'>
						<textarea
							value={message}
							onChange={e => setMessage(e.target.value)}
							placeholder='Введите сообщение...'
							className='flex-1 border border-[#bfbfbf] rounded px-2 py-1 h-25.5 focus:outline-none focus:border-green-600 focus:shadow-button-default caret-green-600 resize-none text-white'
							disabled={isSending}
							rows={4}
						/>
						<button
							type='submit'
							disabled={!message.trim() || isSending}
							className='bg-[#fcd5ba] text-[#ff6633] text-2xl px-4 py-2 h-17 rounded hover:bg-[#ff6633] hover:text-white disabled:cursor-not-allowed cursor-pointer duration-300'
						>
							{isSending ? '...' : 'Отправить'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default OrderChatModal
