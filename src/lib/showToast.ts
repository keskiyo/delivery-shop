import { toast } from 'react-toastify'

export type ToastPayload = {
	type: 'success' | 'error'
	message: string
}

export type PromiseToastMessages = {
	pending: string
	success: string
	error: string
}

export const showToast = ({ type, message }: ToastPayload) => {
	if (type === 'success') {
		toast.success(message)
		return
	}

	toast.error(message)
}

export const showPromiseToast = async <T>(
	promise: Promise<T>,
	messages: PromiseToastMessages,
): Promise<T> => {
	return await toast.promise(promise, messages)
}
