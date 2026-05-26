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
		success: 'text-success bg-success-soft',
		warning: 'text-warning bg-warning-soft',
		error: 'text-danger bg-danger-soft',
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
