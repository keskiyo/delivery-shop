import { CheckCircle } from 'lucide-react'
import { AuthFormLayout } from '../../_components/AuthFormLayout'

const SuccessUpdatePass = () => {
	return (
		<AuthFormLayout>
			<div className='max-w-md mx-auto mt-10 p-6 text-center'>
				<CheckCircle className='w-16 h-16 text-success mx-auto mb-4' />
				<h1 className='text-2xl font-bold mb-4 text-success'>
					Пароль успешно изменен!
				</h1>
				<p className='text-muted-foreground'>
					Вы будете перенаправлены на страницу входа...
				</p>
			</div>
		</AuthFormLayout>
	)
}

export default SuccessUpdatePass
