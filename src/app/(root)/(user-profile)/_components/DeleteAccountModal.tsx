'use client'

interface DeleteAccountModalProps {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	error?: string | null
}


const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	error,
}) => {
	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-muted/80 backdrop-blur-sm flex items-center justify-center z-50'>
			<div className='bg-card rounded p-6 w-96'>
				<h3 className='text-xl font-bold mb-4'>
					Подтверждение удаления
				</h3>

				{error && (
					<div className='mb-4 p-3 bg-danger-soft border border-danger/30 text-danger rounded text-sm'>
						{error}
					</div>
				)}

				<p className='mb-6'>
					Вы уверены, что хотите удалить свой аккаунт? Это действие
					нельзя отменить.
				</p>

				<div className='flex justify-end gap-3'>
					<button
						onClick={onClose}
						className='flex-1 bg-site-chrome border-none text-white rounded flex hover:shadow-button-secondary p-2 justify-center items-center active:shadow-(--shadow-button-active) duration-300 cursor-pointer'
					>
						Отмена
					</button>
					<button
						onClick={onConfirm}
						className='flex-1 px-4 py-2 bg-danger text-white rounded hover:shadow-button-cancel duration-300 cursor-pointer'
					>
						Удалить
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteAccountModal
