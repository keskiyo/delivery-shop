import { AlertCircle } from 'lucide-react'
import { ReactNode } from 'react'

const AlertMessage = ({
	type,
	message,
}: {
	type: 'success' | 'warning' | 'error'
	message: ReactNode
}) => {
	const styles = {
		success: 'text-green-600 bg-green-50',
		warning: 'text-yellow-600 bg-yellow-50',
		error: 'text-red-600 bg-red-50',
	}

	return (
		<div
			className={`flex items-center px-3 py-2 rounded mt-3 ${styles[type]}`}
		>
			<AlertCircle className='h-4 w-4 mr-2 shrink-0' />
			<span className='text-sm'> {message} </span>
		</div>
	)
}

export default AlertMessage
